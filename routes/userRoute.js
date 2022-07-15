// Las rutas a las que respondera el aplicativo

// Se importa express
import express from "express";
// Se importa el modelo de usuario creado
import userModel from '../models/userModel.js'
// Se importa bcryptjs para aplicar una función hash a los password y jwt para gestionar los tokens 
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
// Se importa el middleware de autenticación
import isAuthenticated from '../middleware/auth.js'

// Se crea el router
const router = express.Router();

// Se crea la ruta para registrar usuarios
router.post('/register',async(req,res)=>{

    try {
        
        //Obtiene la información del usuario desde el body
        const {name, email, password} = req.body;
        
        // Se verifica que los campos no esten vacios
        if(!name || !email || !password){
            return res.json({message: 'Por favor ingrese todos los campos'});
        }

        // Verifica si el usuario ha sido creado previamente
        const userExist = await userModel.findOne({email: email})
        if (userExist){
            return res.json({message: 'El email ingresado ha sido previamente registrado'});
        }

        // Se aplica un hash al password
        // Genera un salt
        const salt = await bcrypt.genSalt(10);
        // Aplica la función hash a la contraseña
        const hashPassword = await bcrypt.hash(password, salt);
        // Se asigna a la contraseña que viene como payload del body la nueva contraseña "hasheada"
        req.body.password = hashPassword;

        // Se crea el usuario
        const user = new userModel(req.body);
        await user.save();
        // Se crea el token usando el atributo id por defecto de mongoo para el modelo y la clave y tiempo de expiracion
        // que se encuentra en las variables de entorno
        const token = await jwt.sign({id: user._id}, process.env.SECRET_KEY,{
            expiresIn: process.env.JWT_EXPIRE,
        });

        // Se retorna una cookie con la información del usuario creada
        return res.cookie('token',token).json({sucess:true, message:"Usuario creado satisfactoriamente",data:user});

    } catch (error) {
        return res.json({error:error}); // En caso de error lo retorna en formato json
    }
});

// Se crea la ruta para el login de usuarios
router.post('/login',async(req,res)=>{
    try {
        
        // Se obtienen del body el email y la contraseña y se válida que no sean vacias
        const {email, password} = req.body;
        if(!email || !password){
            return res.json({message: 'Por favor ingrese todos los campos'})
        }

        // Se válida que el usuario exista
        const userExist = await userModel.findOne({email:email});
        if(!userExist){
            return res.json({message: 'Credenciales inválidas'})
        }

        // Se verifica que el password coincida
        const isPasswordMatched = await bcrypt.compare(password,userExist.password);
        if(!isPasswordMatched){
            return res.json({message:'La contraseña no coincide'});
        }

        // Se crea el token
        const token = await jwt.sign({id:userExist._id},process.env.SECRET_KEY,{
            expiresIn: process.env.JWT_EXPIRE,
        });
        // Se retorna la cookie con información del login
        return res.cookie("token",token).json({sucess:true,message:'Se ingreso correctamente'})

    } catch (error) {
        return res.json({error: error});
    }
});

// Se crea la ruta para obtener la información de los usuarios
// Se le asigna a esta ruta el middleware para que solo sea accesible cuando el usuario está logeado
router.get('/user', isAuthenticated, async(req,res)=>{
    try {

        // Busca el usuario
        const user = await userModel.findById(req.user.id);
        if(!user){
            return res.json({message: 'Usuario no encontrado'});
        }
        
        return res.json({user:user});

    } catch (error) {
        return res.json({error:error});
    }
});

// Se exporta el modulo
export default router;
