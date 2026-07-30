import { useState, useEffect } from "react";

const LEGEND_ITEMS = [
  {
    icon: "fa-solid fa-dna",
    color: "#368270",
    label: "Criatura verde",
    text: "Herbívoro - se alimenta apenas de comida.",
  },
  {
    icon: "fa-solid fa-dna",
    color: "#9b7924",
    label: "Criatura marrom",
    text: "Carnívoro - caça e se alimenta de herbívoros.",
  },
  {
    icon: "fa-solid fa-atom",
    color: "#9948c1",
    label: "Ponto roxo",
    text: "Comida disponível para os herbívoros comerem.",
  },
  {
    icon: "fa-solid fa-sun",
    color: "#fff700",
    label: "Brilho amarelo ao redor",
    text: "A criatura acumulou energia suficiente e está prestes a se reproduzir.",
  },
];

export function InfoPanel() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      // Se a tela for maior que 768px, força a abertura do painel
      if (window.innerWidth > 768) {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggle = (e) => {
    // Atualiza o estado de acordo com a ação do usuário no mobile
    setIsOpen(e.currentTarget.open);
  };

  return (
    <details className="panel info-panel" open={isOpen} onToggle={handleToggle}>
      <summary>
        <span>Legenda / Informações</span>
        <span className="info-panel-caret" aria-hidden="true">
          ▾
        </span>
      </summary>

      <div className="info-panel-body">
        <ul className="legend-list">
          {LEGEND_ITEMS.map((item) => (
            <li key={item.label}>
              <i
                className={item.icon}
                style={{
                  color: item.color,
                  fontSize: "1.1em",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              />
              <span>
                <strong>{item.label}:</strong> {item.text}
              </span>
            </li>
          ))}
        </ul>

        <p className="legend-note">
          <i className="fa-solid fa-code-fork"></i> A reprodução acontece
          automaticamente quando a criatura ultrapassa o limite de energia dela
          - metade da carga vira o filhote, que nasce com uma pequena mutação na
          rede neural.
        </p>

        <p className="legend-note">
          <i className="fa-solid fa-hourglass-end"></i> Cada criatura vive entre
          30 e 90 segundos. À medida que envelhecem, sua cor vai se tornando
          mais escura.
        </p>

        <p className="legend-note">
          <i className="fa-solid fa-skull-crossbones"></i> Quando a energia
          chega a zero, a criatura morre e some do mapa.
        </p>
      </div>
    </details>
  );
}
