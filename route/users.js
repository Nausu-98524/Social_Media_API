const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Update User
router.put("/:id", async(req, res)=>{
    const { userId, isAdmin, password} = req.body;

    if(userId === req.params.id || isAdmin){
        if(password){
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);

            } catch (error) {
                return res.status(500).json(error);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set : req.body,
            })
            res.status(200).json("Account has been Updated.")
        } catch (error) {
            return res.status(500).json(error);
        }
    }else{
        return res.status(403).json("You Can only Update your account!");
    }
})

//Delete User
router.delete("/:id", async(req, res)=>{
    const {userId, isAdmin } = req.body;
    if(userId === req.params.id || isAdmin){
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch (error) {
            return res.status(500).json(error);
        }
    }else{
        return res.status(403).json("You can delete only your account!");
    }
})

//Get a User
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
      const user = userId
        ? await User.findById(userId)
        : await User.findOne({ username: username });
      const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//Follow a user
router.put("/:id/follow", async(req, res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({ $push :{ followers : req.body.userId }})
                await currentUser.updateOne({ $push : { followings : req.params.id }})
                res.status(200).json("user has been followed");
            }else{
                res.status(403).json("You allready follow this user")
            }
        } catch (error) {
            res.status(403).json(error)
        }
    }else{
        res.status(403).json("You can't follow yourself");
    }
})

//Unfollow a user
router.put("/:id/unfollow", async(req, res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({ $pull : { followers : req.body.userId }});
                await currentUser.updateOne({ $pull : { followings : req.params.id }})
                res.status(200).json("User has been unfollowed")
            }else{
                res.status(403).json("You don't follow this user")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("You can't unfollow yourself")
    }
})

module.exports = router