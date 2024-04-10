const User = require('../models/UserModel'); 

class UserRepository {
  async getUserById(userId) {
    return await User.findById(userId);
  }

  async updateUser(userId, userData) {
    return await User.findByIdAndUpdate(userId, userData);
  }
 
}

module.exports = UserRepository;