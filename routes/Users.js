const express = require("express");
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
  
    await user.save();
  
    res.send('User created');
  });
  
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }
  
    const validPassword = await bcrypt.compare(password, user.password);
  
    if (!validPassword) {
      return res.status(400).send('Invalid credentials');
    }
  
    const token = jwt.sign({ _id: user._id }, 'secret');
  
    res.cookie('authtoken', token, {
      secure: process.env.NODE_ENV === 'localhost' ? 'auto' : true,
      httpOnly: true,
      maxAge: 7*24*60*60*1000,   //days*hoursPerDay*minutesPerHour*secondsPerMinute*1000
      sameSite: process.env.NODE_ENV === 'localhost' ? 'lax' : 'none',
  
    }).status(200).send('Logged in')
  
  });


router.get('/auth',(req, res) => {
    const token = req.cookies.authtoken;
    
    if(!token){
        return res.status(401).send("you are not authenticated!!")
    }

    jwt.verify(token, 'secret', (err, user) => {
        if(err){
            return res.status(403).send("Token is not valid!!")
        }
        res.status(200).json(user)
    })
}
)

router.get('/logout',(req, res) => {
  res.cookie("authtoken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "logged Out",
  });
})

module.exports = router;
