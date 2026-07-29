  export class Food {
    constructor(canvasWidth, canvasHeight) {
      // Posiciona a comida aleatoriamente dentro do mapa
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      this.size = 6;
      this.energyValue = 30; // Quanto de energia ela devolve para a criatura ao ser comida
    }

    // Desenha a comida
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.fillStyle = "#9948c1";
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    }
  }
