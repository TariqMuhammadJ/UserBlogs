const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('./models/Users');
const dotenv = require('dotenv');
const session = require('express-session');
dotenv.config();
const { generateSecureId, checkPassword, checkIfUserExists } = require('./sec/sec');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

router.use(session({
    secret: 'yourSecret',
    resave: false,
    saveUninitialized: true
  }));
const authenticateJWT = (req, res, next) =>{
  const token = req.cookies.token || req.header('Authorization')?.split(' ')[1];
  if(!token){
    return res.status(403).send("Access denied no token provided").redirect("/login");
  }

  jwt.verify(token, secretKey, (err, user) =>{
    if(err){
      return res.status(403).send("Invalid or expired token").redirect("/login");

    }

    console.log(token);

    req.user = user;
    next();

  })
}




router.get('/registration', (req, res)=>{
  res.sendFile(path.join(__dirname, 'views', 'registration.html'))
});


router.get('/registration', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'registration.html'));
});

// Handle registration form submission
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await checkIfUserExists(username, email);
  if (existingUser) {
    return res.status(400).send("Username or Email Already Exists");
  } else {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateSecureId(10);
    // Create and save the new user
    const newUser = new User({ userId, username, email, password: hashedPassword });
    await newUser.save();

    // Redirect to login page after successful registration
    res.status(201).redirect('/login');
  }
});
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
  });

  // Handle login form submission
 // Handle login form submission
router.post('/login', async (req, res) => {
  const { email , password } = req.body;
  try {
    // Find the user by username
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).send("Invalid User Credentials");
    }

    // Check if the entered password matches the stored hashed password
    const isPasswordValid = await checkPassword(password, user.password);
    
    if (isPasswordValid) {
      // Password matches, redirect with user ID
      const token = jwt.sign({ userId: user.userId, username: user.username }, secretKey, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000 });
      res.status(200).redirect(`/?id=${user.userId}`);
      req.session.user={userId:user.userId};
      console.log(req.session.user.userId);
    } else {
      // Invalid password
      res.status(400).send("Invalid password");
    }

  } catch (err) {
    // If there was an error in the process
    console.error(err); // Log the error for debugging purposes
    res.status(500).send("Server Error");
  }
});

router.get('/user-info', authenticateJWT, (req, res) =>{
    res.sendFile(path.join(__dirname, 'views', 'userInfo.html'));

})

router.get('/posts', authenticateJWT,  (req, res) =>{
    res.sendFile(path.join(__dirname, 'views', 'posts.html'));
});



module.exports = router;