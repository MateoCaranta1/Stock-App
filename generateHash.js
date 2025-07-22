const bcrypt = require('bcrypt');

const password = 'TuNuevaContraseña123';
const SALT_ROUNDS = 10;

bcrypt.hash(password, SALT_ROUNDS)
  .then(hash => {
    console.log('Hash generado:', hash);
  })
  .catch(err => {
    console.error('Error al generar hash:', err);
  });