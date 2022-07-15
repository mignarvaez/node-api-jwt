// Archivo que representa el modelo de usuarios de la aplicación
import mongoose from "mongoose";

// Se crea un esquema o estructura del usuario usando mongoose
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        minLength:[4, 'El nombre debería tener minimo 4 carácteres']
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minLength:[8, 'La contraseña debe ser de mínimo 8 carácteres']
    },
    token:{
        type:String //token para la autenticación jwt
    }

});

// Se crean los modelos
let userModel;
export default userModel = mongoose.model('user',userSchema);
// Se exporta el modelo del usuario creado

