import { NeuralNetwork } from "./NeuralNetwork.js";
import { simulationConfig as CONFIG } from "../simulation/simulationConfig.js";

export class Creature {
  constructor(x, y, brain = null, type = "herbivore", traits = null) {
    // Posição e Física
    this.x = x;
    this.y = y;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = 0;
    this.rotationSpeed = 0.1;

    // Tipo de Dieta (herbivore/carnivore)
    this.type = type;

    // Atributos Específicos por Tipo (Balanço Biológico)
    const resolvedTraits =
      traits ??
      (() => {
        const base =
          this.type === "carnivore"
            ? CONFIG.behavior.carnivore
            : CONFIG.behavior.herbivore;

        return {
          speed: base.speed,
          sensorLength: base.sensorLength,
          reproduceThreshold: base.reproduceThreshold,
          initialEnergy: CONFIG.energy.initialEnergy,
          maxEnergy: CONFIG.energy.maxEnergy,
        };
      })();

    // Estado de Sobrevivência e Reprodução
    this.energy = resolvedTraits.initialEnergy;
    this.maxEnergy = resolvedTraits.maxEnergy;
    this.isDead = false;
    this.generation = 1;

    // Tempo de vida
    this.age = 0;
    this.maxLifespan = 1800 + Math.random() * 3600;

    this.sensorLength = resolvedTraits.sensorLength;
    this.reproduceThresh = resolvedTraits.reproduceThreshold;
    this.maxSpeed = resolvedTraits.speed;

    // Cérebro Artificial
    if (brain) {
      this.brain = brain;
    } else {
      this.brain = new NeuralNetwork(8, 8, 2);
    }
  }

  // ------- ATUALIZAÇÃO DA CRIATURA -------
  update(foodList, creatureList, newCreatures, canvasWidth, canvasHeight) {
    if (this.isDead) return;
    this.age++;

    // Alimentação
    if (this.type === "herbivore") {
      this.checkFoodCollision(foodList);
    } else if (this.type === "carnivore") {
      this.checkHuntingCollision(creatureList);
    }

    // Coleta dados dos sensores visuais
    const inputs = this.readSensors(foodList, creatureList);
    // Verifica se existe algum estímulo por perto
    const sawSomething = inputs.some((value) => value > 0);

    // Se houver comida ou predador, usa a IA para tomar decisões, caso contrário entra em modo exploração
    let outputs;
    if (sawSomething) {
      outputs = this.brain.predict(inputs);
    } else {
      outputs = [(Math.random() - 0.5) * 0.2, 0.5];
    }

    // Aplica giro e aceleração
    this.angle += outputs[0] * this.rotationSpeed;
    this.speed = Math.max(0, outputs[1]) * this.maxSpeed;
    // Atualiza posição no mapa
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    // Limites do mapa
    const margin = 10;

    if (this.x < margin) {
      this.x = margin;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 0;
    } else if (this.x > canvasWidth - margin) {
      this.x = canvasWidth - margin;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 0;
    }

    if (this.y < margin) {
      this.y = margin;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 0;
    } else if (this.y > canvasHeight - margin) {
      this.y = canvasHeight - margin;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 0;
    }

    // Gasto Metabólico
    this.energy -=
      0.02 +
      this.speed * 0.03 +
      Math.abs(outputs[0]) * 0.05 +
      this.age * 0.000002;

    // Verificação de Morte
    if (this.energy <= 0 || this.age >= this.maxLifespan) {
      this.energy = 0;
      this.isDead = true;
    }

    // Reprodução
    if (this.energy >= this.reproduceThresh) {
      this.reproduce(newCreatures);
    }
  }

  // ------- MITOSE -------
  reproduce(newCreatures) {
    // O filho pega metade da energia do pai.
    const childEnergy = this.energy / 2;
    this.energy -= childEnergy;

    let childBrain = this.brain.clone();
    childBrain.mutate(); // Mutação aletória de até 8%

    // Define uma posição aleatória próxima ao pai,
    let spawnOffsetX = (Math.random() - 0.5) * 30;
    let spawnOffsetY = (Math.random() - 0.5) * 30;

    // Cria o filho
    let child = new Creature(
      this.x + spawnOffsetX,
      this.y + spawnOffsetY,
      childBrain,
      this.type,
      {
        speed: this.maxSpeed,
        sensorLength: this.sensorLength,
        reproduceThreshold: this.reproduceThresh,
        initialEnergy: childEnergy,
        maxEnergy: this.maxEnergy,
      },
    );

    child.energy = childEnergy;
    child.generation = this.generation + 1; // Em andamento
    newCreatures.push(child);
  }

  // ------- LEITURA DOS SENSORES VISUAIS -------
  readSensors(foodList, creatureList) {
    // Sensores da comida [frente, direita, trás, esquerda]
    let foodSensors = [0, 0, 0, 0];
    // Sensores de perigo (carnívoros) [frente, direita, trás, esquerda]
    let dangerSensors = [0, 0, 0, 0];

    // --- Herbívoros
    if (this.type === "herbivore") {
      // Procura a comida mais próxima dentro do alcance da visão
      let closestFood = null;
      let minFoodDistance = Infinity;

      for (let food of foodList) {
        const dx = food.x - this.x;
        const dy = food.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < minFoodDistance && dist < this.sensorLength) {
          minFoodDistance = dist;
          closestFood = food;
        }
      }

      // Caso exista uma comida visível, atualiza os sensores indicando em qual direção ela está
      if (closestFood) {
        this.fillDirectionalSensors(
          closestFood.x,
          closestFood.y,
          minFoodDistance,
          foodSensors,
        );
      }

      // Procura o carnívoro   mais próximo
      let closestCarnivore = null;
      let minCarnivoreDistance = Infinity;

      for (let other of creatureList) {
        if (other.type !== "carnivore" || other.isDead) continue;

        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < minCarnivoreDistance && dist < this.sensorLength) {
          minCarnivoreDistance = dist;
          closestCarnivore = other;
        }
      }
      // Caso exista um predador visível, preenche os sensores de perigo
      if (closestCarnivore) {
        this.fillDirectionalSensors(
          closestCarnivore.x,
          closestCarnivore.y,
          minCarnivoreDistance,
          dangerSensors,
        );
      }
    }

    // --- Carnívoros
    else {
      // Carnívoros procuram apenas herbívoros.
      let closestHerbivore = null;
      let minDistance = Infinity;

      for (let other of creatureList) {
        if (other.type !== "herbivore" || other.isDead) continue;

        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < minDistance && dist < this.sensorLength) {
          minDistance = dist;
          closestHerbivore = other;
        }
      }
      // Atualiza os sensores indicando onde está a presa
      if (closestHerbivore) {
        this.fillDirectionalSensors(
          closestHerbivore.x,
          closestHerbivore.y,
          minDistance,
          foodSensors,
        );
      }
    }

    return [...foodSensors, ...dangerSensors];
  }

  // Recebe um alvo (comida ou predador) e informa em qual direção ele está.
  fillDirectionalSensors(targetX, targetY, distance, sensors) {
    let angleToTarget = Math.atan2(targetY - this.y, targetX - this.x);
    let diffAngle = angleToTarget - this.angle;
    diffAngle = Math.atan2(Math.sin(diffAngle), Math.cos(diffAngle));
    let normalizedDist = 1 - distance / this.sensorLength;

    if (Math.abs(diffAngle) < Math.PI / 4) {
      sensors[0] = normalizedDist; // frente
    } else if (diffAngle >= Math.PI / 4 && diffAngle < (3 * Math.PI) / 4) {
      sensors[1] = normalizedDist; // direita
    } else if (diffAngle <= -Math.PI / 4 && diffAngle > (-3 * Math.PI) / 4) {
      sensors[3] = normalizedDist; // esquerda
    } else {
      sensors[2] = normalizedDist; // atrás
    }
  }

  // ------- DESENHO DA CRIATURA NO CANVAS -------
  draw(ctx) {
    if (this.isDead) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Cor base do corpo
    let bodyColor = this.type === "herbivore" ? "#368270" : "#9b7924";

    // Aura de reprodução se estiver cheia de energia
    if (this.energy > this.reproduceThresh - 20) {
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#fff700";
    }
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 8, 0, 0, 2 * Math.PI);
    ctx.fillStyle = bodyColor;
    ctx.fill();

    // Escurecimento por idade
    const ageRatio = Math.min(1, this.age / this.maxLifespan);
    ctx.fillStyle = `rgba(0, 0, 0, ${ageRatio * 0.8})`;
    ctx.fill();

    // Borda
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

  // ------- COLISÃO E ALIMENTAÇÃO -------
  checkFoodCollision(foodList) {
    if (this.isDead) return;
    for (let i = foodList.length - 1; i >= 0; i--) {
      let food = foodList[i];
      let dx = food.x - this.x;
      let dy = food.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 15 + food.size) {
        this.energy = Math.min(this.maxEnergy, this.energy + food.energyValue);
        foodList.splice(i, 1);
      }
    }
  }

  // --- LÓGICA DE CAÇA ---
  checkHuntingCollision(creatureList) {
    if (this.isDead || this.type !== "carnivore") return;

    for (let other of creatureList) {
      if (other.type === "herbivore" && !other.isDead) {
        let dx = other.x - this.x;
        let dy = other.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 20) {
          this.energy = Math.min(this.maxEnergy, this.energy + 70); // Quanto ganha de energia
          other.isDead = true;
        }
      }
    }
  }
}
