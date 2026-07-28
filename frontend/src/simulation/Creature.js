import { NeuralNetwork } from "./NeuralNetwork.js";

export class Creature {
  constructor(x, y, brain = null, type = "herbivore") {
    //Posição e Física
    this.x = x;
    this.y = y;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = 0;
    this.rotationSpeed = 0.1;

    //Tipo de Dieta
    this.type = type;

    //Estado de Sobrevivência e Reprodução
    this.energy = 150;
    this.maxEnergy = 200;
    this.isDead = false;
    this.generation = 1;

    //Atributos Específicos por Tipo (Balanço Biológico)
    if (this.type === "carnivore") {
      this.sensorLength = 140;
      this.reproduceThresh = 150;
      this.maxSpeed = 3.5;
    } else {
      this.sensorLength = 130;
      this.reproduceThresh = 130;
      this.maxSpeed = 3.0;
    }

    // Cérebro Artificial
    // 4 Entradas (Visão) -> 6 Neurônios Ocultos -> 2 Saídas (Giro e Aceleração)
    if (brain) {
      this.brain = brain;
    } else {
      this.brain = new NeuralNetwork(4, 6, 2);
    }
  }

  // --- ATUALIZAÇÃO DA CRIATURA ---
  // Atualiza física, consome energia, toma decisões e tenta se reproduzir
  update(foodList, creatureList, newCreatures, canvasWidth, canvasHeight) {
    if (this.isDead) return; // Morto

    // Alimentação
    if (this.type === "herbivore") {
      this.checkFoodCollision(foodList);
    } else if (this.type === "carnivore") {
      this.checkHuntingCollision(creatureList);
    }

    // Coleta dados dos sensores visuais
    const inputs = this.readSensors(foodList, creatureList);

    // Pede decisão para a Rede Neural
    const outputs = this.brain.predict(inputs);

    // Aplica giro e aceleração
    this.angle += outputs[0] * this.rotationSpeed;
    this.speed = Math.max(0, outputs[1]) * this.maxSpeed;

    // Atualiza posição no mapa
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    // Limites do mapa
    const margin = 10; // Distância do centro do corpo até a borda da parede

    if (this.x < margin) {
      this.x = margin;
      this.speed = 0;
    } else if (this.x > canvasWidth - margin) {
      this.x = canvasWidth - margin;
      this.speed = 0;
    }

    if (this.y < margin) {
      this.y = margin;
      this.speed = 0;
    } else if (this.y > canvasHeight - margin) {
      this.y = canvasHeight - margin;
      this.speed = 0;
    }

    // Gasto Metabólico: Existir e correr consome energia
    this.energy -= 0.02 + (this.speed * 0.03) + (Math.abs(outputs[0]) * 0.05);

    // Verificação de Morte
    if (this.energy <= 0) {
      this.energy = 0;
      this.isDead = true;
    }

    // Reprodução: Se acumulou muita energia, gera um filho. 
    if (this.energy >= this.reproduceThresh) {
      this.reproduce(creatureList);
    }
  }

  // --- MITOSE ---
  reproduce(newCreatures) {
    // Transfere metade da energia para o filho
    const childEnergy = this.energy / 2;
    this.energy -= childEnergy;

    // Clona o cérebro com uma pequena mutação nos pesos
    let childBrain = this.brain.clone();
    childBrain.mutate(0.25); // 25% de taxa de mutação nos neurônios

    // O filho nasce ao lado da mãe
    let spawnOffsetX = (Math.random() - 0.5) * 30;
    let spawnOffsetY = (Math.random() - 0.5) * 30;

    // Cria a nova instância
    let child = new Creature(
      this.x + spawnOffsetX,
      this.y + spawnOffsetY,
      childBrain,
      this.type,
    );

    child.energy = childEnergy;
    child.generation = this.generation + 1;

    // Adiciona a nova criatura na população
    newCreatures.push(child);
  }

  // --- LEITURA DOS SENSORES VISUAIS ---
  readSensors(foodList, creatureList) {
    let sensors = [0, 0, 0, 0];
    let closestTarget = null;
    let minDistance = Infinity;

    if (this.type === "herbivore") {
      // Herbívoros procuram a COMIDA mais próxima
      for (let food of foodList) {
        let dx = food.x - this.x;
        let dy = food.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < minDistance && dist < this.sensorLength) {
          minDistance = dist;
          closestTarget = food;
        }
      }
    } else if (this.type === "carnivore") {
      // Carnívoros procuram o HERBÍVORO mais próximo
      for (let other of creatureList) {
        if (other.type === "herbivore" && !other.isDead) {
          let dx = other.x - this.x;
          let dy = other.y - this.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < minDistance && dist < this.sensorLength) {
            minDistance = dist;
            closestTarget = other;
          }
        }
      }
    }

    // Processa a visão em relação ao alvo encontrado
    if (closestTarget) {
      let angleToTarget = Math.atan2(
        closestTarget.y - this.y,
        closestTarget.x - this.x,
      );
      let diffAngle = angleToTarget - this.angle;

      diffAngle = Math.atan2(Math.sin(diffAngle), Math.cos(diffAngle));

      let normalizedDist = 1 - minDistance / this.sensorLength;

      if (Math.abs(diffAngle) < Math.PI / 4) {
        sensors[0] = normalizedDist; // Frente
      } else if (diffAngle >= Math.PI / 4 && diffAngle < (3 * Math.PI) / 4) {
        sensors[1] = normalizedDist; // Direita
      } else if (diffAngle <= -Math.PI / 4 && diffAngle > (-3 * Math.PI) / 4) {
        sensors[3] = normalizedDist; // Esquerda
      } else {
        sensors[2] = normalizedDist; // Trás
      }
    }

    return sensors;
  }

  // --- DESENHO DA CRIATURA NO CANVAS ---
  draw(ctx) {
    if (this.isDead) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Define a cor de acordo com a dieta
    let bodyColor = this.type === "herbivore" ? "#368270" : "#9b7924";

    // Se estiver prestes a se reproduzir (energia alta), ganha uma aura.
    if (this.energy > this.reproduceThresh - 20) {
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#fff700";
    }

    //Desenha o corpo da criatura
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 8, 0, 0, 2 * Math.PI);
    ctx.fillStyle = bodyColor;
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Desenha o olho
    ctx.beginPath();
    ctx.arc(7, 0, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(8, 0, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "#000000";
    ctx.fill();

    ctx.restore();
  }

  // --- COLISÃO E ALIMENTAÇÃO ---
  checkFoodCollision(foodList) {
    if (this.isDead) return;

    for (let i = foodList.length - 1; i >= 0; i--) {
      let food = foodList[i];
      let dx = food.x - this.x;
      let dy = food.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 15 + food.size) {
        // Recupera energia ao comer a planta
        this.energy = Math.min(this.maxEnergy, this.energy + food.energyValue);
        foodList.splice(i, 1);
      }
    }
  }

  // --- LÓGICA DE CAÇA PARA OS CARNÍVOROS ---
  checkHuntingCollision(creatureList) {
    if (this.isDead || this.type !== "carnivore") return;

    for (let other of creatureList) {
      // Só caça se o outro for um Herbívoro vivo
      if (other.type === "herbivore" && !other.isDead) {
        let dx = other.x - this.x;
        let dy = other.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Se encostou no herbívoro
        if (distance < 20) {
          this.energy = Math.min(this.maxEnergy, this.energy + 70); // Carnívoro ganha energia
          other.isDead = true; // O herbívoro morre instantaneamente
        }
      }
    }
  }
}
