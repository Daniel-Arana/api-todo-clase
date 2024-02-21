require("dotenv").config();
const express = require("express");
const {getTareas, crearTarea, borrarTarea, actualizarEstado, actualizarTexto} = require("./db");
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

servidor.put("/api-todo/actualizar/:id([0-9]+)/:operacion(1/2)", async (peticion, respuesta, siguiente) => {
    /*
    let operacion = Number(peticion.params.operacion);

    let operaciones = [actualizarEstado, actualizarTexto];

    let {tarea} = peticion.body;//extraemos la tarea
    
    if (operacion == 1 && (!tarea || tarea.trim() == "")){
        //si existe la operación 1 tiene que verificar que es distinto de tarea o que tiene algo escrito
        return siguiente ({error: "falta el argumento tarea en el objeto JSON"});
}

    try{
        let cantidad = await operaciones [operacion - 1](peticion.params.id, operacion == 1 ? tarea : null);
        respuesta.json({resultado : cantidad ? "ok" : "ko"});

    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }*/

    /* otra forma de hacer lo mismo pero con if: */
    if (peticion.params.operacion == 1){
        let {tarea} = peticion.body;
        if (tarea && tarea.trim() != ""){
            try{
                let cantidad = await actualizarEstado(peticion.params.id, tarea);
                return respuesta.json({resultado : cantidad ? "ok" : "ko"});
            }catch (error){
                respuesta.status(500);
                respuesta.json(error);
            }
        }

        siguiente ({error : "falta el argumento tarea en el objeto JSON"});
    } else{
        try{
            let cantidad = await actualizarTexto(peticion.params.id);
            return respuesta.json({resultado : cantidad ? "ok" : "ko"})
        }catch(error){
            respuesta.status(500);
            respuesta.json(error);
        }
    }

});

servidor.delete("/api-todo/borrar/:id([0-9]+)", async (peticion, respuesta) => {
    try{
        let cantidad = await borrarTarea(peticion.params.id);
        return respuesta.json({resultado : cantidad ? "ok" : "ko"});//return sobra, aunque no hace nada si se queda
    } catch (error){
        respuesta.status(500);
        return respuesta.json(error);
    }

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
