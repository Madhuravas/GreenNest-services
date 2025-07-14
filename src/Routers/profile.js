const express = require('express');
const profileRouter = express.Router();


profileRouter.get("/profile/get", async (req, res) => {
    try{

    }catch(err){
        res.status(500).json({ message: "Internal Server Error" });
    }
});