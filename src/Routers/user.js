const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');

userRouter.get("/users", async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = userRouter;