import { useState } from "react";
import {
  simulationConfig,
  resetSimulationConfig,
} from "../simulation/simulationConfig.js";

// Botão "ativado/desativado"
function ToggleSwitch({ value, onChange }) {
  return (
    <div className="toggle-group">
      <button
        type="button"
        className={value ? "toggle-btn active-on" : "toggle-btn"}
        onClick={() => onChange(true)}
      >
        ativado
      </button>
      <button
        type="button"
        className={!value ? "toggle-btn active-off" : "toggle-btn"}
        onClick={() => onChange(false)}
      >
        desativado
      </button>
    </div>
  );
}

// Lê o estado atual do objeto de configuração real para popular os campos controlados do formulário.
function readConfigFromSingleton() {
  return {
    initialHerbivores: simulationConfig.population.initialHerbivores,
    initialCarnivores: simulationConfig.population.initialCarnivores,
    initialFood: simulationConfig.food.initialFood,
    foodSpawnRate: simulationConfig.food.foodSpawnRate,
    maxFoodEnabled: simulationConfig.food.maxFood.enabled,
    maxFood: simulationConfig.food.maxFood.max,
    maxHerbivoresEnabled: simulationConfig.population.maxHerbivores.enabled,
    maxHerbivores: simulationConfig.population.maxHerbivores.max,
    maxCarnivoresEnabled: simulationConfig.population.maxCarnivores.enabled,
    maxCarnivores: simulationConfig.population.maxCarnivores.max,
    herbivoreSpeed: simulationConfig.behavior.herbivore.speed,
    carnivoreSpeed: simulationConfig.behavior.carnivore.speed,
  };
}

export function ConfigPanel({ onRestart }) {
  const [config, setConfig] = useState(readConfigFromSingleton);

  const update = (key, rawValue, applyToSingleton) => {
    setConfig((prev) => ({ ...prev, [key]: rawValue }));
    applyToSingleton(rawValue);
  };

  const handleResetDefaults = () => {
    resetSimulationConfig();
    setConfig(readConfigFromSingleton());
    onRestart();
  };

  return (
    <div className="panel config-panel">
      <h2>Definições</h2>

      <div className="config-sections-wrapper">
        <div className="config-sections">
          <section className="field-section">
            <h3 className="section-title">
              População inicial{" "}
              <span className="badge badge-restart">só ao reiniciar</span>
            </h3>

            <div className="field">
              <label>Herbívoros iniciais</label>
              <input
                type="number"
                min="0"
                value={config.initialHerbivores}
                onChange={(e) =>
                  update("initialHerbivores", Number(e.target.value), (v) => {
                    simulationConfig.population.initialHerbivores = v;
                  })
                }
              />
            </div>

            <div className="field">
              <label>Carnívoros iniciais</label>
              <input
                type="number"
                min="0"
                value={config.initialCarnivores}
                onChange={(e) =>
                  update("initialCarnivores", Number(e.target.value), (v) => {
                    simulationConfig.population.initialCarnivores = v;
                  })
                }
              />
            </div>
          </section>

          <section className="field-section">
            <h3 className="section-title">
              Limites de população{" "}
              <span className="badge badge-live">aplica na hora</span>
            </h3>

            <div className="field">
              <label>Limite de herbívoros</label>
              <ToggleSwitch
                value={config.maxHerbivoresEnabled}
                onChange={(v) =>
                  update("maxHerbivoresEnabled", v, (val) => {
                    simulationConfig.population.maxHerbivores.enabled = val;
                  })
                }
              />
              <input
                type="number"
                min="1"
                disabled={!config.maxHerbivoresEnabled}
                value={config.maxHerbivores}
                onChange={(e) =>
                  update("maxHerbivores", Number(e.target.value), (v) => {
                    simulationConfig.population.maxHerbivores.max = v;
                  })
                }
              />
            </div>

            <div className="field">
              <label>Limite de carnívoros</label>
              <ToggleSwitch
                value={config.maxCarnivoresEnabled}
                onChange={(v) =>
                  update("maxCarnivoresEnabled", v, (val) => {
                    simulationConfig.population.maxCarnivores.enabled = val;
                  })
                }
              />
              <input
                type="number"
                min="1"
                disabled={!config.maxCarnivoresEnabled}
                value={config.maxCarnivores}
                onChange={(e) =>
                  update("maxCarnivores", Number(e.target.value), (v) => {
                    simulationConfig.population.maxCarnivores.max = v;
                  })
                }
              />
            </div>
          </section>

          <section className="field-section">
            <h3 className="section-title">Comida</h3>

            <div className="field">
              <label>
                Comida inicial{" "}
                <span className="badge badge-restart">só ao reiniciar</span>
              </label>
              <input
                type="number"
                min="0"
                value={config.initialFood}
                onChange={(e) =>
                  update("initialFood", Number(e.target.value), (v) => {
                    simulationConfig.food.initialFood = v;
                  })
                }
              />
            </div>

            <div className="field">
              <label>
                Comida gerada por segundo{" "}
                <span className="badge badge-live">aplica na hora</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={config.foodSpawnRate}
                onChange={(e) =>
                  update("foodSpawnRate", Number(e.target.value), (v) => {
                    simulationConfig.food.foodSpawnRate = v;
                  })
                }
              />
            </div>

            <div className="field">
              <label>
                Limite de comida{" "}
                <span className="badge badge-live">aplica na hora</span>
              </label>
              <ToggleSwitch
                value={config.maxFoodEnabled}
                onChange={(v) =>
                  update("maxFoodEnabled", v, (val) => {
                    simulationConfig.food.maxFood.enabled = val;
                  })
                }
              />
              <input
                type="number"
                min="1"
                disabled={!config.maxFoodEnabled}
                value={config.maxFood}
                onChange={(e) =>
                  update("maxFood", Number(e.target.value), (v) => {
                    simulationConfig.food.maxFood.max = v;
                  })
                }
              />
            </div>
          </section>

          <section className="field-section">
            <h3 className="section-title">
              Comportamento{" "}
              <span className="badge badge-restart">só ao reiniciar</span>
            </h3>

            <div className="field">
              <label>Velocidade herbívoro</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={config.herbivoreSpeed}
                onChange={(e) =>
                  update("herbivoreSpeed", Number(e.target.value), (v) => {
                    simulationConfig.behavior.herbivore.speed = v;
                  })
                }
              />
            </div>

            <div className="field">
              <label>Velocidade carnívoro</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={config.carnivoreSpeed}
                onChange={(e) =>
                  update("carnivoreSpeed", Number(e.target.value), (v) => {
                    simulationConfig.behavior.carnivore.speed = v;
                  })
                }
              />
            </div>
          </section>
        </div>
        <div id="fade"></div>
      </div>

      <div className="config-actions">
        <button type="button" className="restart-btn" onClick={onRestart}>
          Reiniciar simulação
        </button>
        <button
          type="button"
          className="reset-btn"
          onClick={handleResetDefaults}
        >
          Restaurar configuração padrão
        </button>
      </div>
    </div>
  );
}
