import express from "express";
import { exec } from "child_process";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// Endpoint que ejecuta el pronóstico NARX
app.post("/api/pronostico", (req, res) => {
  console.log("Recibido:", req.body);

  const inputFile = "input.json";
  const outputFile = "output.json";

  // Guarda los datos recibidos en input.json (si los necesitas)
  const fs = require("fs");
  fs.writeFileSync(inputFile, JSON.stringify(req.body));

  // Ejecuta el script compilado de MATLAB Runtime
  const cmd = `"./compiled/autoNARX_forecast" ${inputFile} ${outputFile}`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error("Error:", stderr);
      res.status(500).json({ error: stderr });
      return;
    }

    console.log("Salida MATLAB:", stdout);
    const result = JSON.parse(fs.readFileSync(outputFile, "utf-8"));
    res.json(result);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
