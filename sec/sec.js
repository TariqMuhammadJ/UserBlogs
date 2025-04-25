const User = require('../models/Users');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


  
function generateSecureId(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}

async function checkPassword(plainTextPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
  return isMatch;
};

async function checkIfUserExists(username, email) {
  const user = await User.findOne({
    $or: [
      { username: username },
      { email: email }
    ]
  });

  return user; // This will return the user object if found, or null if not found
}

module.exports = {
    generateSecureId,
    checkPassword,
    checkIfUserExists
  };