// reset-senha.js
const bcrypt = require('bcryptjs');

bcrypt.hash('nova123', 10).then(hash => {
  console.log(hash);
});