// Configuração central da simulação E.C.O.S.


export const simulationConfig = {
  // --- POPULAÇÃO INICIAL ---
  population: {
    initialHerbivores: 10,
    initialCarnivores: 10,

    maxHerbivores: {
      enabled: false,
      max: 150,
    },
    maxCarnivores: {
      enabled: false,
      max: 50,
    },
  },

  // --- COMIDA / RECURSOS ---
  food: {
    initialFood: 150,

    foodSpawnRate: 2,

    maxFood: {
      enabled: false,
      max: 300,
    },
  },

  // --- ATRIBUTOS DE COMPORTAMENTO / BALANÇO BIOLÓGICO ---
  behavior: {
    herbivore: {
      speed: 3.0,
      sensorLength: 130, // Alcance de "visão" (em pixels)
      reproduceThreshold: 130, // Energia mínima acumulada para gerar um filhote
    },
    carnivore: {
      speed: 3.5,
      sensorLength: 140,
      reproduceThreshold: 150,
    },
  },

  // --- ENERGIA ---
  energy: {
    initialEnergy: 150, // Energia com que a criatura nasce
    maxEnergy: 200, // Energia máxima que a criatura pode acumular
  },
};

export default simulationConfig;