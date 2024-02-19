require("dotenv").config();
const express = require("express");
const {getTareas, crearTarea} = require("./db");
const {json} = require ("body-parser");

const servidor = express();

servidor.use(json());//cualquier cosa que venga con content-type json entra aquí y es procesado

servidor.use("/pruebas", express.static("./pruebas_api"));
//si alguien me pide esta url quiero con express servir ficheros estáticos de la
//carpeta /prueba-api

servidor.get("/api-todo", async (peticion, respuesta) => {
    try{
        let tareas = await getTareas();
        respuesta.json(tareas);

    } catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
});

servidor.post("/api-todo/crear", async (peticion, respuesta, siguiente) => {

    let {tarea} = peticion.body;
    //creará una variable tarea desestructurada de un objeto que supuestamente la tiene.
    //Si la tiene, tarea tendrá el valor de lo que ha escrito la persoa. Si no la tiene, será "undefined"

    if(tarea && tarea.trim() != ""){
        try{
            let id = await crearTarea({tarea});
            return respuesta.json({id}); //el return es importante para que no salga el siguiente
        }catch (error){
            respuesta.status(500);
            return respuesta.json(error);
        }
    }

    siguiente({error: "falta el argumento tarea en el objeto JSON"});

});

servidor.put("/api-todo", (peticion, respuesta) => {
    respuesta.send("metodo PUT");
});

servidor.delete("/api-todo", (peticion, respuesta) => {
    respuesta.send("metodo DELETE");
});

servidor.use((peticion, respuesta)=>{
    respuesta.status(404);
    respuesta.json({error : "not found"});
});

servidor.use((error, peticion, respuesta, siguiente)=>{ //este rooting interno es muy importante
    respuesta.status(400)
    respuesta.json({error: "petición no válida"});
});

servidor.listen(process.env.PORT);
