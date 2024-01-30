const socket = io();

socket.on('actualizarProductos', (productos) => {
  
  console.log('Productos actualizados:', productos);
  
});