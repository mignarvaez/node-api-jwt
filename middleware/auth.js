// Middleware encargado de la autenticación para las peticiones
// Un middleware tiene acceso a la petición, el objeto respuesta y la función next en el ciclo petición - respuesta
// La función next se invoca cuando la función ejecución ha sido terminada. Se usa next cuando
// tienes que ejecutar una función callback o un middleware

// Se importa el modelo del usuario y jwt
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'

// Se valida si el usuario está autenticado o no
const isAuthenticated = async (req, res, next) =>{
    try {
        
        // Se obtienen el token de las cookies
        const {token} = req.cookies;
        
        // Si no hay token se asume que no está logeado
        if(!token){
            return next('Por favor ingrese para visualizar los datos')
        }

        // Se verifica el token
        const verify = await jwt.verify(token, process.env.SECRET_KEY);

        // Se hace una busqueda del usuario verificado por su id
        req.user = await userModel.findById(verify.id);
        next();

    } catch (error) {
        return next(error);
    }
}

// Se exporta el módulo
export default isAuthenticated