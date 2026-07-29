import { useEffect, useRef, useState } from "react";
import { Creature } from "../simulation/Creature.js";
import { Food } from "../simulation/Food.js";
import { simulationConfig as CONFIG } from "../simulation/simulationConfig.js";

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
    for (let i = 0; i < CONFIG.population.initialHerbivores; i++) {
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
    for (let i = 0; i < CONFIG.population.initialCarnivores; i++) {
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
    for (let i = 0; i < CONFIG.food.initialFood; i++) {
      foodList.push(new Food(canvas.width, canvas.height));
    }

    // ----- LOOP DO ECOSSISTEMA
    const render = () => {
      // Limpa os desenhos do frame anterior
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Repõe comida gradualmente, respeitando o limite máximo (se ativado)
      const foodCap = CONFIG.food.maxFood.enabled
        ? CONFIG.food.maxFood.max
        : Infinity;

      for (let i = 0; i < CONFIG.food.foodSpawnRate; i++) {
        if (foodList.length >= foodCap) break;
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

      // Adiciona os filhotes nascidos, respeitando os limites de
      // superpopulação individuais de cada espécie (se ativados).
      for (const child of newCreatures) {
        if (child.type === "herbivore") {
          const canAdd =
            !CONFIG.population.maxHerbivores.enabled ||
            hCount < CONFIG.population.maxHerbivores.max;

          if (canAdd) {
            creatures.push(child);
            hCount++;
          }
        } else if (child.type === "carnivore") {
          const canAdd =
            !CONFIG.population.maxCarnivores.enabled ||
            cCount < CONFIG.population.maxCarnivores.max;

          if (canAdd) {
            creatures.push(child);
            cCount++;
          }
        }
      }

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
