import express from "express";
import { formularioLogin, formularioOlvidePassword, formularioRegistro, registrar,confirmar} from "../controllers/usuarioController.js";

const router = express.Router();


//Routing
router.get("/login", formularioLogin);
router.get("/registro",formularioRegistro);
router.get("/confirmar/:token",confirmar);
router.get("/olvide-password",formularioOlvidePassword);

router.post("/registro",registrar);




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