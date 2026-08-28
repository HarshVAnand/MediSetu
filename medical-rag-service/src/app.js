import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import ragRoutes from "./routes/ragRoutes.js";


dotenv.config();


const app = express();


app.use(cors());

app.use(express.json());


app.get("/", (req, res) => {

  res.json({
    message:
      "Medical OCR and RAG service is running"
  });

});


app.use(
  "/api/rag",
  ragRoutes
);


const PORT =
  process.env.PORT || 5000;


app.listen(
  PORT,
  () => {

    console.log(
      `Server running on http://localhost:${PORT}`
    );

  }
);