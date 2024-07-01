document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form.deleteForm').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault(); 
  
        const cid = form.dataset.cid;
        const pid = form.dataset.pid;
  
        fetch(`/api/carts/${cid}/remove/${pid}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          if (response.ok) {
           
            form.parentElement.remove(); 
  
            
            updateTotals();
          } else {
            return response.json().then(data => {
              throw new Error(data.error || 'Failed to delete product');
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert(`Failed to delete product: ${error.message}`);
        });
      });
    });
  
    function updateTotals() {
      let totalQuantity = 0;
      let totalPrice = 0;
  
      document.querySelectorAll('li').forEach(function (item) {
        const quantity = parseInt(item.querySelector('span.quantity').innerText, 10);
        const price = parseFloat(item.querySelector('span.price').innerText.slice(1));
        totalQuantity += quantity;
        totalPrice += price * quantity;
      });
  
      document.querySelector('#totalQuantity').innerText = totalQuantity;
      document.querySelector('#totalPrice').innerText = `$${totalPrice.toFixed(2)}`;
    }
  });