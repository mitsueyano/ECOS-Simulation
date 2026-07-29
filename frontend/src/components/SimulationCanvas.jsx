import { useEffect, useRef, useState } from "react";
import { Creature } from "../simulation/Creature.js";
import { Food } from "../simulation/Food.js";

export function SimulationCanvas() {
  const canvasRef = useRef(null);
  const [stats, setStats] = useState({ herbivores: 0, carnivores: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // População inicial
    let creatures = [];

    // ----- GERAÇÃO DE CRIATURAS
    // Criar Herbívoros
    for (let i = 0; i < 40; i++) {
      creatures.push(
        new Creature(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          null,
          "herbivore",
        ),
      );
    }
    // Criar Carnívoros
    for (let i = 0; i < 10; i++) {
      creatures.push(
        new Creature(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          null,
          "carnivore",
        ),
      );
    }

    // Comidas para os herbívoros
    let foodList = [];
    for (let i = 0; i < 150; i++) {
      foodList.push(new Food(canvas.width, canvas.height));
    }

    // ----- LOOP DO ECOSSISTEMA
    const render = () => {
      // Limpa os desenhos do frame anterior
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Repõe plantas se a quantidade cair muito
      while (foodList.length < 140) {
        foodList.push(new Food(canvas.width, canvas.height));
      }
      // Desenha as Plantas
      for (let food of foodList) {
        food.draw(ctx);
      }

      // Contadores de criaturas vivas
      let hCount = 0;
      let cCount = 0;

      // Fila temporária para novos filhotes nascidos neste frame
      let newCreatures = [];

      // ATUALIZAÇÃO, DESENHO E LIMPEZA DE MEMÓRIA (Iteração de trás para frente para evitar pular uma criatura removida com o splice)
      for (let i = creatures.length - 1; i >= 0; i--) {
        let creature = creatures[i];

        // Executa a lógica de atualização da criatura
        creature.update(
          foodList,
          creatures,
          newCreatures,
          canvas.width,
          canvas.height,
        );

        // Se morreu, remove do array imediatamente para liberar a memória RAM
        if (creature.isDead) {
          creatures.splice(i, 1);
          continue; // Pula o desenho e vai para a próxima
        }

        // Se está viva, desenha no canvas e incrementa contadores
        creature.draw(ctx);

        if (creature.type === "herbivore") hCount++;
        if (creature.type === "carnivore") cCount++;
      }

      // Adiciona os filhotes nascidos (com limite de superpopulação de 150 para manter 60 FPS)
      /*
      if (creatures.length < 150 && newCreatures.length > 0) {
        creatures.push(...newCreatures);
      }
      */

      // Atualiza o placar no React
      setStats({ herbivores: hCount, carnivores: cCount });

      // Chama o próximo frame
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cancela a animação ao desmontar o componente
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <div
        style={{
          color: "#fff",
          marginBottom: "10px",
          fontSize: "18px",
          display: "flex",
          gap: "20px",
        }}
      >
        <span>
          <strong>Herbívoros:</strong> {stats.herbivores}
        </span>
        <span>
          <strong>Carnívoros:</strong> {stats.carnivores}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={1300}
        height={800}
        style={{  
          backgroundColor: "#315e3b",
          border: "3px solid #00518b",
          borderRadius: "8px",
        }}
      />
    </div>
  );
}
