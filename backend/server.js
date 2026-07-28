import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/status", (req, res) => {
  res.json({ status: "ECOS Backend rodando com sucesso!" });
});

app.listen(PORT, () => {
  console.log(`!!! Backend rodando em http://localhost:${PORT} !!!`);
});
