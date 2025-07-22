const bcrypt = require('bcrypt');

const hash = '$2b$10$MmxaGZkfL5/Yu5JH.KoI6ugIyC/EyeoCWHH2nGObCjVluQWTXDolW'; // hash guardado en DB
const password = 'Contraseña123'; // la contraseña que querés probar

bcrypt.compare(password, hash)
  .then(result => {
    if (result) {
      console.log('La contraseña coincide con el hash');
    } else {
      console.log('La contraseña NO coincide con el hash');
    }
  })
  .catch(err => {
    console.error('Error al comparar:', err);
  });
