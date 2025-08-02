import express from "express";
import { formularioLogin,comprobarToken,nuevoPassword,resetPassword, formularioOlvidePassword, formularioRegistro, registrar,confirmar} from "../controllers/usuarioController.js";

const router = express.Router();


//Routing
router.get("/login", formularioLogin);

router.get("/registro",formularioRegistro);
router.post("/registro",registrar);

router.get("/confirmar/:token",confirmar);

router.get("/olvide-password",formularioOlvidePassword);
router.post("/olvide-password",resetPassword);

//Almacena el nuevo password
router.get("/olvide-password/token",comprobarToken);
router.post("/olvide-password/token",nuevoPassword);



/*
router.post("/",(req,res)=>{
    res.json({msg:"Respuesta POST"})
})
*/

/*
router.route("/")
.get(function(req,res){
    res.json({msg:"respuesta GET"});
})
.post(function(req,res){
    res.json({msg:"respuesta POST"});
})
    */

export default router;