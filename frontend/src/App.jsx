import { useCallback, useState } from "react";
import { ConfigPanel } from "./components/Configpanel.jsx";
import { StatsPanel } from "./components/Statspanel.jsx";
import { InfoPanel } from "./components/Infopanel.jsx";
import { SimulationCanvas } from "./components/SimulationCanvas.jsx";
import "./index.css";

function App() {
  const [resetKey, setResetKey] = useState(0);

  const [stats, setStats] = useState({
    herbivores: 0,
    carnivores: 0,
    food: 0,
    maxGeneration: 1,
    elapsedSeconds: 0,
  });

  const handleRestart = useCallback(() => {
    setResetKey((key) => key + 1);
  }, []);

  return (
    <div className="app">
      <h1 className="app-title">
        Simulador de Organismos Complexos Evolutivos
      </h1>

      <div className="app-stats">
        <StatsPanel stats={stats} />
      </div>

      <div className="app-layout">
        <div className="app-config">
          <ConfigPanel onRestart={handleRestart} />
        </div>

        <div className="app-canvas">
          <SimulationCanvas key={resetKey} onStatsUpdate={setStats} />
        </div>

        <div className="app-info">
          <InfoPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
