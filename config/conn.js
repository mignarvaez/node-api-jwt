// Archivo encargado de la conexión a la base de datos

// Se importa el ORM mongoose para trabajar con los datos
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config({path:'./config/config.env'}); // Toco cargar a la fuerza la configuración env en este archivo

mongoose.connect(process.env.URI, // La URI de acceso a la base
    // Esta opción se usa para evitar un warning que aparece debido a node y el driver que maneja para mongodb. Se indica que use el nuevo parser
    {useNewUrlParser: true,
    // Esta opción se usa para evitar un warning que aparece debido a node y el driver que maneja para mongodb. Se indica que use la nueva topologia 
    useUnifiedTopology: true})
    .then((data)=>{
        console.log(`Base de datos conectada a ${data.connection.host}`);
    }); 

