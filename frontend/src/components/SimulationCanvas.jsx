import { useEffect, useRef } from "react";
import { Creature } from "../simulation/Creature.js";
import { Food } from "../simulation/Food.js";
import { simulationConfig as CONFIG } from "../simulation/simulationConfig.js";

export function SimulationCanvas({ onStatsUpdate }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    const startTime = Date.now();

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

    // Acumulador de spawn de comida baseado em tempo real (segundos),
    // não em número de frames — assim o ritmo de geração de comida
    // não muda dependendo do FPS do navegador/aparelho do usuário.
    let foodSpawnAccumulator = 0;
    let lastFrameTime = performance.now();

    // ------- LOOP DO ECOSSISTEMA DO CANVAS -------
    const render = (now) => {
      // Delta de tempo em segundos desde o frame anterior. O teto de
      // 0.25s evita um "salto" de comida se a aba ficar minimizada.
      const delta = Math.min((now - lastFrameTime) / 1000, 0.25);
      lastFrameTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa os desenhos do frame anterior

      // Gera novas comidas de acordo com a taxa configurada (por segundo)
      const foodCap = CONFIG.food.maxFood.enabled
        ? CONFIG.food.maxFood.max
        : Infinity;

      foodSpawnAccumulator += CONFIG.food.foodSpawnRate * delta;
      while (foodSpawnAccumulator >= 1 && foodList.length < foodCap) {
        foodList.push(new Food(canvas.width, canvas.height));
        foodSpawnAccumulator -= 1;
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

      // Repassa as estatísticas para o painel do lado direito
      if (onStatsUpdate) {
        let maxGeneration = 0;
        for (const creature of creatures) {
          if (creature.generation > maxGeneration) {
            maxGeneration = creature.generation;
          }
        }

        onStatsUpdate({
          herbivores: hCount,
          carnivores: cCount,
          food: foodList.length,
          maxGeneration,
          elapsedSeconds: (Date.now() - startTime) / 1000,
        });
      }

      // Chama o próximo frame
      animationFrameId = requestAnimationFrame(render);
    };
    animationFrameId = requestAnimationFrame(render);

    // Cancela a animação ao desmontar o componente
    return () => cancelAnimationFrame(animationFrameId);
  }, [onStatsUpdate]);

  // ------- ------- ------- ------- Exibição
  return (
    <div className="canvas-wrapper">
      <canvas ref={canvasRef} width={1300} height={800} />
    </div>
  );
}