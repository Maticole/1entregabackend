const generateMockedProducts = () => {
    const mockedProducts = [];
    for (let i = 0; i < 100; i++) {
      mockedProducts.push({
        name: `Product ${i + 1}`,
        price: Math.floor(Math.random() * 100) + 1,
    });
    }
    return mockedProducts;
  };
  
  module.exports = { generateMockedProducts };