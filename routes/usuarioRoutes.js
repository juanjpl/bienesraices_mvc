import express from "express";

const router = express.Router();


//Routing
router.get("/", function(req,res){
    res.json({msg:"Hola mundo en express desde index"});
})


router.get("/nosotros", function(req,res){
    res.send("Informacion de nosotros")
})

export default router;