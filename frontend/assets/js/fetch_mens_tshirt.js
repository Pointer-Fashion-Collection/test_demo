fetch('https://ecommerce-2-x700.onrender.com/api/mens/tshirt')
  .then(res => {
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  })
  .then(data => {
    const container = document.querySelector('.mens_tshirt_show');
    container.innerHTML = '';

    data.forEach(product => {
      let sizeOptions = '';
      if (Array.isArray(product.size)) {
        sizeOptions = product.size.map(size => `<option>${size}</option>`).join('');
      }

      container.innerHTML += `
        <div class="child">
          <div class="image">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="details">
            <table>
              <tr><td style="text-align:center;"><strong>${product.name}</strong></td></tr>
              <tr><td>Type: ${product.type}</td></tr>
              <tr><td>Color: ${product.colo || 'N/A'}</td></tr>
              <tr><td>Size: <select>${sizeOptions}</select></td></tr>
              <tr><td style="text-align:center;"><button class="buy-btn">Buy It</button></td></tr>
            </table>
          </div>
        </div>`;
    });
  })
  .catch(error => {
    console.error('Error fetching T-shirts:', error);
    const container = document.querySelector('.mens_tshirt_show');
    if (container) container.innerHTML = '<p style="color:red;">Failed to load T-shirts.</p>';
  });
