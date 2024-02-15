require("dotenv").config();
const express = require("express");

const servidor = express();

servidor.use("/pruebas", express.static("./pruebas_api"));
//si alguien me pide esta url quiero con express servir ficheros estáticos de la
//carpeta /prueba-api

servidor.get("/api-todo", async (peticion, respuesta) => {
    respuesta.send("metodo GET");
});

servidor.post("/crear-color", async (peticion, respuesta) => {
    respuesta.send("metodo POST");
});

servidor.put("/crear-color", async (peticion, respuesta) => {
    respuesta.send("metodo PUT");
});

servidor.delete("/crear-color", async (peticion, respuesta) => {
    respuesta.send("metodo DELETE");
});

servidor.use((peticion, respuesta)=>{
    respuesta.json({error : "not found"});
});

servidor.listen(process.env.PORT);
