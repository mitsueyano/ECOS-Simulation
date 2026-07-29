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

    // ------- GERAÇÃO DE CRIATURAS -------

    // População inicial
    let creatures = [];

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
    let foodTimer = 0;

    // ------- LOOP DO ECOSSISTEMA DO CANVAS -------
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa os desenhos do frame anterior

      // Timer de spawn da comida
      foodTimer++;
      if (foodTimer >= CONFIG.food.foodSpawnRate) {
        const foodCap = CONFIG.food.maxFood.enabled
          ? CONFIG.food.maxFood.max
          : Infinity;

        if (foodList.length < foodCap) {
          foodList.push(new Food(canvas.width, canvas.height));
        }
        foodTimer = 0;
      }
      // Desenha a comida
      for (let food of foodList) {
        food.draw(ctx);
      }

      // Contadores de criaturas vivas
      let hCount = 0;
      let cCount = 0;
      let newCreatures = []; // Fila temporária para novos filhotes nascidos neste frame

      // --- Atualização, desenho e limpeza de memória
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

        // Se morreu
        if (creature.isDead) {
          creatures.splice(i, 1);
          continue; // Pula o desenho e vai para a próxima
        }
        // Se está viva
        creature.draw(ctx);
        if (creature.type === "herbivore") hCount++;
        if (creature.type === "carnivore") cCount++;
      }

      // Adiciona os filhotes nascidos, respeitando os limites de superpopulação de cada espécie (se ativados)
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

  // ------- ------- ------- ------- Exibição
  return (
    <div id="container">
      <div id="config">
        <h3>Configurações</h3>
        {/* Em andamento */}
      </div>

      <canvas ref={canvasRef} width={1300} height={800} />

      <div id="stats">
        <h3>Painel</h3>
        {/* Em andamento */}
        <div id="creatures-alive">
          <div>
            <i class="fa-solid fa-atom herb"></i>
            <strong>Herbívoros:</strong> {stats.herbivores}
          </div>
          <div>
            <i class="fa-solid fa-atom carn"></i>
            <strong>Carnívoros:</strong> {stats.carnivores}
          </div>
        </div>
      </div>
    </div>
  );
}
