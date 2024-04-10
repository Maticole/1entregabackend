class DAOFactory {
    static getDAO(daoType) {
      if (daoType === 'fileSystem') {
        const FileSystemDAO = require('./fileSystem/cartManager'); 
        return new FileSystemDAO();
      }
      
      throw new Error('Tipo de DAO no válido');
    }
  }
  
  module.exports = DAOFactory;