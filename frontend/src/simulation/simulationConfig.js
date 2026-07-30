// Configuração central da simulação E.C.O.S.

const DEFAULTS = {
  // --- POPULAÇÃO INICIAL ---
  population: {
    initialHerbivores: 30,
    initialCarnivores: 8,

    maxHerbivores: {
      enabled: true,
      max: 120,
    },
    maxCarnivores: {
      enabled: true,
      max: 35,
    },
  },

  // --- COMIDA / RECURSOS ---
  food: {
    initialFood: 190,

    // Comidas novas geradas por segundo.
    foodSpawnRate: 4,

    maxFood: {
      enabled: true,
      max: 290,
    },
  },

  // --- ATRIBUTOS DE COMPORTAMENTO / BALANÇO BIOLÓGICO ---
  behavior: {
    herbivore: {
      speed: 2.6,
      sensorLength: 150, // Alcance de "visão" (em pixels)
      reproduceThreshold: 145, // Energia mínima acumulada para gerar um filhote
    },
    carnivore: {
      speed: 3,
      sensorLength: 150,
      reproduceThreshold: 185,
    },
  },

  // --- ENERGIA ---
  energy: {
    initialEnergy: 110, // Energia com que a criatura nasce
    maxEnergy: 200, // Energia máxima que a criatura pode acumular
  },
};

export const simulationConfig = structuredClone(DEFAULTS);

// Restaura todos os campos para os valores padrão do projeto.
export function resetSimulationConfig() {
  const fresh = structuredClone(DEFAULTS);
  simulationConfig.population = fresh.population;
  simulationConfig.food = fresh.food;
  simulationConfig.behavior = fresh.behavior;
  simulationConfig.energy = fresh.energy;
}

export default simulationConfig;
