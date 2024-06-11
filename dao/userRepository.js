const User = require('../dao/models/userModel');

class UserRepository {
  constructor(model) {
    this.model = model;
  }

  async getAll() {
    try {
      return await this.model.find();
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error.message);
      return [];
    }
  }

  async getById(id) {
    return await this.model.findById(id);
  }

  async create(data) {
    try {
      const newUser = new this.model(data);
      await newUser.save();
      console.log("Usuario creado correctamente.");
    } catch (error) {
      console.error("Error al crear el usuario:", error.message);
    }
  }

  async update(id, data) {
    return await this.model.findByIdAndUpdate(id, data);
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }
}

module.exports = UserRepository;