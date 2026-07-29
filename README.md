# 🌿 ECOS - Evolutionary Complex Organism Simulator

O **E.C.O.S.** é uma simulação interativa 2D de seleção natural e autonomia biológica que roda no navegador. A aplicação simula um ecossistema dinâmico onde organismos virtuais nascem, buscam recursos, consomem energia, reproduzem-se transmitindo características genéticas e morrem.

---

## 🛠️ Tecnologias Utilizadas

- **Front-End:** React + Vite
- **Renderização Gráfica:** HTML5 Canvas (2D)
- **Back-End:** Node.js + Express
- **Lógica e Física:** JavaScript ES6+

---

## 👾 Como Executar o Projeto

Abra o terminal na pasta raiz **ECOS** e siga as etapas:

### 1. Iniciar o Backend
```bash
cd backend
npm run dev
```

### 2. Iniciar o Frontend
Em um novo terminal:
```bash
cd frontend
npm run dev
```

> **Nota:** O navegador abrirá a simulação automaticamente. Caso não abra, acesse o endereço exibido no terminal (por padrão `http://localhost:5173`).

### 🛑 Encerrando a Aplicação

Como o projeto utiliza servidores locais, fechar a aba do navegador não encerra os processos. Para finalizar completamente:

1. Acesse os terminais onde o **Backend** e o **Frontend** estão sendo executados.
2. Pressione **`Ctrl + C`** (Windows/Linux) ou **`Cmd + C`** (Mac) em cada um deles.
3. Se solicitado (`Deseja fechar o arquivo em lote? (S/N)`), confirme digitando **`S`** e pressione `Enter`.

---

📄 *Documentações detalhadas de arquitetura, parâmetros e manuais do sistema estão disponíveis na pasta de documentação do projeto.*
