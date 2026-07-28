import { SimulationCanvas } from "./components/SimulationCanvas";
import "./index.css";

function App() {
  return (
    <div
      style={{ textAlign: "center", color: "#fff", fontFamily: "sans-serif" }}
    >
      <h1>Simulador de Organismos Complexos Evolutivos</h1>
      <SimulationCanvas />
    </div>
  );
}

export default App;
