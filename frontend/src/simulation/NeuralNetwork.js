/* 
Função de ativação Tangente Hiperbólica
    Não se assuste com o nome, pense nela como uma função que "espreme" qualquer número para ficar entre -1 e 1.
    - números muito negativos ficam próximos de -1
    - números próximos de 0 continuam próximos de 0
    - números muito positivos ficam próximos de 1
    exemplo: tanh(-3) = -0.999... && tanh(3) = 0.999..

Por que usar ela no código?
    - Evita valores gigantes ou descontrolados de velocidade e rotação.
    - É simétrica, os valores negativos (-1 a 0) servem para virar à esquerda ou dar ré, 
      enquanto os positivos (0 a 1) servem para virar à direita ou acelerar.
    [0.0, 0.0]: A criatura não gira e não se move.
    [0.0, 1.0]: A criatura não gira e anda direto pra frente.
    [-1.0, 0.0]: A criatura gira rápido pra esquerda, mas sem sair do lugar.
*/
function tanh(x) {
  return Math.tanh(x);
}

// --- ESTRUTURA E COMPORTAMENTO ---

// Para instanciar  um cérebro na simulação: const brain = new NeuralNetwork(a, b, c);
export class NeuralNetwork {
  constructor(inputNodes, hiddenNodes, outputNodes) {
    this.inputNodes = inputNodes; // Quantidade de neurônios de entrada
    this.hiddenNodes = hiddenNodes; // Quantidade de neurônios da camada oculta
    this.outputNodes = outputNodes; // Quantidade de neurônios de saída

    // Cria uma matriz de pesos que liga a camada de entrada à camada oculta.
    this.weightsInputHidden = this.createRandomMatrix(
      this.hiddenNodes,
      this.inputNodes,
    );

    // Cria uma matriz de pesos que liga a camada oculta à camada de saída.
    this.weightsHiddenOutput = this.createRandomMatrix(
      this.outputNodes,
      this.hiddenNodes,
    );

    // Cria um bias (pequeno ajuste) para cada neurônio da camada oculta.
    this.biasHidden = this.createRandomArray(this.hiddenNodes);

    // Cria um bias para cada neurônio da camada de saída.
    this.biasOutput = this.createRandomArray(this.outputNodes);
  }

  // Processa entradas (valores dos sensores) e retorna decisões ([Giro, Aceleração])
  predict(inputArray) {
    // ETAPA 1 (Entrada -> Camada Oculta)
    // Pega os sinais dos sensores e combina para formar "ideias/conceitos"
    let hidden = [];
    for (let i = 0; i < this.hiddenNodes; i++) {
      let sum = 0;

      // Soma os dados de cada sensor multiplicados pelos pesos da conexão (Entrada -> Oculta)
      for (let j = 0; j < this.inputNodes; j++) {
        sum += inputArray[j] * this.weightsInputHidden[i][j];
      }

      // Adiciona a tendência do neurônio (bias) e espreme o resultado entre -1 e 1
      sum += this.biasHidden[i];
      hidden[i] = tanh(sum);
    }

    // ETAPA 2 (Camada Oculta -> Saída)
    // Pega o "pensamento" criado na camada oculta e calcula a ação final
    let outputs = [];
    for (let i = 0; i < this.outputNodes; i++) {
      let sum = 0;

      // Soma os valores dos neurônios ocultos multiplicados pelos pesos da conexão (Oculta -> Saída)
      for (let j = 0; j < this.hiddenNodes; j++) {
        sum += hidden[j] * this.weightsHiddenOutput[i][j];
      }

      // Adiciona o bias da saída e limita a força do motor entre -1 e 1 com o tanh
      sum += this.biasOutput[i];
      outputs[i] = tanh(sum);
    }

    // Retorna a decisão final para os motores
    return outputs;
  }

  // Mutação Genética para a próxima geração
  mutate(rate = 0.1) {
    //taxa de mutação.
    const mutateValue = (val) => {
      if (Math.random() < rate) {
        return val + (Math.random() * 2 - 1) * 0.5;
      }
      return val;
    };

    this.weightsInputHidden = this.weightsInputHidden.map((row) =>
      row.map(mutateValue),
    );
    this.weightsHiddenOutput = this.weightsHiddenOutput.map((row) =>
      row.map(mutateValue),
    );
    this.biasHidden = this.biasHidden.map(mutateValue);
    this.biasOutput = this.biasOutput.map(mutateValue);
  }

  // Clona a rede para reprodução
  clone() {
    const cloneNN = new NeuralNetwork(
      this.inputNodes,
      this.hiddenNodes,
      this.outputNodes,
    );

    // Os pesos e biases são substituídos pelos valores da rede original.
    cloneNN.weightsInputHidden = JSON.parse(
      JSON.stringify(this.weightsInputHidden),
    );
    cloneNN.weightsHiddenOutput = JSON.parse(
      JSON.stringify(this.weightsHiddenOutput),
    );
    cloneNN.biasHidden = [...this.biasHidden]; // Spread Operator pois é uma matriz
    cloneNN.biasOutput = [...this.biasOutput]; // Spread Operator pois é uma matriz
    return cloneNN;
  }

  // --- MÉTODOS AUXILIARES ---
  createRandomMatrix(rows, cols) {
    let matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix[i] = this.createRandomArray(cols);
    }
    return matrix;
  }

  createRandomArray(length) {
    let arr = [];
    for (let i = 0; i < length; i++) {
      arr[i] = Math.random() * 2 - 1;
    }
    return arr;
  }
}
