const fs = require('fs');
const axios = require('axios');

const uploadToServer = (filePath = './data/productos.json') => {
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');

    axios.post('URL_DEL_SERVIDOR_O_SERVICIO', {
        data: JSON.parse(fileData)
      })
      .then(response => {
        console.log('Archivo JSON subido correctamente:', response.data);
      })
      .catch(error => {
        console.error('Error al subir el archivo JSON:', error);
      });
  } catch (error) {
    console.log("Error al leer el archivo:", error.message);
  }
};

module.exports = uploadToServer;