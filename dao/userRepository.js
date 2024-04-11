const User = require('../models/UserModel');

class UserRepository {
  async getAllUsers() {
    try {
      return await User.find();
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error.message);
      return [];
    }
  }

  async getUserById(userId) {
    return await User.findById(userId);
  }

  async createUser(userData) {
    try {
      const newUser = new User(userData);
      await newUser.save();
      console.log("Usuario creado correctamente.");
    } catch (error) {
      console.error("Error al crear el usuario:", error.message);
    }
  }

  async updateUser(userId, userData) {
    return await User.findByIdAndUpdate(userId, userData);
  }

  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId);
  }
}

module.exports = UserRepository;