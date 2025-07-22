const express = require('express');
const router = express.Router();
const User = require('../Schema/User');

// Create a new user
router.post('/register', async(req, res) => {
    try{
        const { name, email, password, age } = req.body;
        const newUser = new User({ name, email, password, age });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
})

//login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user && user.password === password) {
            res.send("Login Success");
        } else {
            res.status(400).send("Invalid email or password");
        }

    } catch (error) {
        res.status(500).json({ message: "Error in login", error: error.message });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// Get user by Id
router.get('/user/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        if(user){
            res.status(200).json(user);
        }
        else{
            res.send("No User found");
        }
    }
    catch(error){
        res.status(500).json({message:"Error fetching users",error:error.message});
    }
})

// delete user
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (user) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

//put request
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, age } = req.body;

        const updatedUser = await User.findById(id);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        updatedUser.name = name;
        updatedUser.email = email;
        updatedUser.password = password;
        updatedUser.age = age;
        await updatedUser.save();
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});

module.exports = router;