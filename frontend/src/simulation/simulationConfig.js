// Configuração central da simulação E.C.O.S.

/*
--- Configurações fixas --- 

Energia dos herbívoros ao comer: 30
Energia dos carnívoros ao comer: 70

---------------------------
*/
export const simulationConfig = {
  // --- POPULAÇÃO INICIAL ---
  population: {
    initialHerbivores: 10,
    initialCarnivores: 5,

    maxHerbivores: {
      enabled: false,
      max: 50,
    },
    maxCarnivores: {
      enabled: false,
      max: 50,
    },
  },

  // --- COMIDA / RECURSOS ---
  food: {
    initialFood: 100,
    foodSpawnRate: 30,
    maxFood: {
      enabled: true,
      max: 200,
    },
  },

  // --- ATRIBUTOS DE COMPORTAMENTO / BALANÇO BIOLÓGICO ---
  behavior: {
    herbivore: {
      speed: 2.5,
      sensorLength: 140, // Alcance de "visão" (em pixels)
      reproduceThreshold: 130, // Energia mínima acumulada para gerar um filhote
    },
    carnivore: {
      speed: 3,
      sensorLength: 140,
      reproduceThreshold: 150,
    },
  },

  // --- ENERGIA ---
  energy: {
    initialEnergy: 100, // Energia com que a criatura nasce
    maxEnergy: 200, // Energia máxima que a criatura pode acumular
  },
};

export default simulationConfig;