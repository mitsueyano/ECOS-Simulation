# 🌿 ECOS - Evolutionary Complex Organism Simulator

O **E.C.O.S.** é uma simulação interativa 2D de seleção natural e autonomia biológica que roda no navegador. A aplicação simula um ecossistema dinâmico onde organismos virtuais nascem, buscam recursos, consomem energia, reproduzem-se transmitindo características genéticas e morrem.

---

### Tecnologias Utilizadas

| Camada               | Tecnologia            |
|-----------------------|------------------------|
| Front-End             | React + Vite           |
| Renderização Gráfica  | HTML5 Canvas (2D)      |
| Back-End              | Node.js + Express      |
| Lógica e Física       | JavaScript ES6+        |

---

### Pré-requisitos

Antes de começar, você precisa ter o **[Node.js](https://nodejs.org/)** instalado na sua máquina. Para checar se já o possui, rode no terminal:

```bash
node -v
```

> ⚠️ **Usuários de Windows:** dê preferência ao **Command Prompt (CMD)** ou ao **Git Bash** para rodar os comandos abaixo. O PowerShell costuma bloquear scripts do `npm` por padrão.

---

<br>

## 👾 Como Executar o Projeto

### 1. Instalar as dependências

> Esse passo só precisa ser feito na primeira vez (ou sempre que os pacotes forem atualizados).

Na pasta raiz do projeto, instale os pacotes do backend e do frontend:

```cmd
cd backend
npm install

cd ../frontend
npm install
```

### 2. Iniciar a aplicação

A aplicação precisa do backend e do frontend rodando **ao mesmo tempo**, então você vai precisar de **dois terminais abertos**.

**Terminal 1 — Backend:**

```cmd
cd backend
npm run dev
```

**Terminal 2 — Frontend:**

```cmd
cd frontend
npm run dev
```

Depois de iniciar os dois, a aplicação abrirá automaticamente no navegador.

> **Nota:** Caso o navegador não abra sozinho, acesse manualmente o endereço exibido no terminal do frontend (por padrão `http://localhost:5173`).

<br>

## 🛑 Encerrando a Aplicação

Como o projeto utiliza servidores locais, **fechar a aba do navegador não encerra os processos**. Para finalizar completamente:

1. Acesse os dois terminais abertos (backend e frontend).
2. Pressione **`Ctrl + C`** (Windows/Linux) ou **`Cmd + C`** (Mac) em cada um deles.
3. Se o terminal perguntar `Deseja fechar o arquivo em lote? (S/N)`, digite **`S`** e pressione `Enter`.

<br>

## 📄 Documentação Adicional

Documentações detalhadas de arquitetura, parâmetros de simulação e manuais do sistema estão disponíveis na pasta `docs/` do projeto.
