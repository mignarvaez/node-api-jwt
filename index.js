// Archivo principal de la aplicación

// Se importa express y dotenv
import express from 'express'
import dotenv from 'dotenv'

// Se importa cookiparser para facilitar el acceso al token almacenado en la cookie
import cookieParser from 'cookie-parser';

// Se importa el archivo de rutas
import route from './routes/userRoute.js'

// Se configura dotenv indicando la ruta del archivo donde se encuentran definidas las variables de entorno
dotenv.config({path:'./config/config.env'});

// Se importa la conexión a la base de datos
import * as conn from './config/conn.js'

// Se crea la app
const app = express();

// Se indica que se usara express.json para parsear peticiones con payloads en formato Json
app.use(express.json());

// Se indica que se usara cookie parser
app.use(cookieParser());

// Se indican las rutas a usar
// Tendran como parte inicial '/api'
app.use('/api',route)

// Se pone en escucha el servidor
app.listen(process.env.PORT,()=>{
    console.log(`Servidor escuchando en ${process.env.PORT}`);
});
