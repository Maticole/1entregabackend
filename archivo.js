class ProductManager {
    constructor() {
      this.products = [];
      this.productId = 1;
    }
  
    addProduct(title, description, price, thumbnail, code, stock) {
      // Validar que todos los campos sean proporcionados
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log("Todos los campos son obligatorios");
        return;
      }
  
      // Validar que no se repita el campo 'code'
      const codeExists = this.products.some(product => product.code === code);
      if (codeExists) {
        console.log("El código ya existe. Introduce un código único.");
        return;
      }
  
      const newProduct = {
        id: this.productId,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      };
  
      this.products.push(newProduct);
      this.productId++; // Incrementar el ID para el próximo producto
      console.log("Producto agregado:", newProduct);
    }
  
    getProducts() {
      return this.products;
    }
  
    getProductById(id) {
      const product = this.products.find(product => product.id === id);
      if (!product) {
        console.log("Producto no encontrado");
        return;
      }
      return product;
    }
  }
  
  // Ejemplo de uso
  const manager = new ProductManager();
  
  manager.addProduct("Producto 1", "Descripción del producto 1", 25, "imagen1.jpg", "ABC123", 10);
  manager.addProduct("Producto 2", "Descripción del producto 2", 35, "imagen2.jpg", "DEF456", 15);
  
  console.log(manager.getProducts());
  
  console.log(manager.getProductById(1));
  console.log(manager.getProductById(3));