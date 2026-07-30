function formatTime(totalSeconds = 0) {
  const total = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (total % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function StatsPanel({ stats }) {
  const items = [
    ["Herbívoros vivos:", stats.herbivores],
    ["Carnívoros vivos:", stats.carnivores],
    ["Comida disponível:", stats.food],
    ["Geração mais alta:", stats.maxGeneration],
    ["Tempo de simulação:", formatTime(stats.elapsedSeconds)],
  ];

  return (
    <div className="stats-panel">
      <ul className="stats-list">
        {items.map(([label, value]) => (
          <li key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
