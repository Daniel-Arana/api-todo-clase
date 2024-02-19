require("dotenv").config();
const postgres = require("postgres");

function conectar(){
    return postgres({
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });
}

function getTareas(){
    return new Promise(async (ok,ko)=>{
        let conexion = conectar();

        try{
            let tareas = await conexion `SELECT * FROM tareas`;
            conexion.end();
            ok(tareas);
        } catch(error){
            ko({error : "error en base de datos"});
        }
    });
}

function crearTarea({tarea}){//la función crearTarea recibirá un objeto con el campo crear tarea
    return new Promise(async (ok,ko)=>{
        let conexion = conectar();

        try{
            let [{id}] = await conexion `INSERT INTO tareas (tarea) VALUES (${tarea}) RETURNING id`;
            conexion.end();
            ok(id);

        } catch(error){
            ko({error : "error en base de datos"});
        }
    });
}

function borrarTarea(id){
    return new Promise(async (ok,ko) => {
        let conexion = conectar();

        try{
            let {count} = await conexion `DELETE FROM tarea WHERE id = ${id} `;//count dirá cuántas veces ha hecho la consulta
            conexion.end();
            ok(count);
        } catch(error){
            ko({error : "error en base de datos"});
        }
    });
}

module.exports = {getTareas, crearTarea, borrarTarea};