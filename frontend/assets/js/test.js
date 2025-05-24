document.getElementById('productForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const category = document.getElementById('name').value; // tshirt or pant
  const color = document.getElementById('color').value;

  // Handle type (based on T-shirt or Pant)
  const type = category === 't-shirt'
    ? document.getElementById('typeTshirt').value
    : document.getElementById('typePant').value;

  // Sizes
  let sizes = Array.from(document.getElementById('sizes').selectedOptions).map(opt => opt.value);
  if (sizes.includes("S,M,L,XL,XXL")) {
    sizes = ["S", "M", "L", "XL", "XXL"];
  }

const file = document.getElementById("file").value; // e.g., "1-100"
const imageRaw = document.getElementById("image").value; // e.g., "men1.jpg"
const imageNameOnly = imageRaw.split('.')[0]; // "men1"

const image_default = `https://raw.githubusercontent.com/Pointer-Fashion/json_check/main/Mens/T-shirt/${file}/`;
const fullImageURL = image_default + imageNameOnly + ".JPG";

console.log(fullImageURL);

  // Determine endpoint (based on category)
  const endpoint = category === 't-shirt' ? 'tshirt' : 'pant';

  try {
    const res = await fetch(`https://ecommerce-2-x700.onrender.com/api/mens/${endpoint}`);
    if (!res.ok) throw new Error('Failed to fetch existing data');
    const data = await res.json();

    let lastId = 0;
    if (data.length > 0) {
      lastId = parseInt(data[data.length - 1].id, 10) || 0;
    }

    const newProduct = {
      id: lastId + 1,
      name: category,
      type: type,
      color: color,
      size: sizes,
      image: fullImageURL
    };

    // ✅ Show product in console before posting
    console.log("Product to be added:", newProduct);

    // POST new product
    const postRes = await fetch(`https://ecommerce-2-x700.onrender.com/api/mens/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });

    if (postRes.ok) {
      document.getElementById('status').textContent = 'Product added successfully!';
      document.getElementById('productForm').reset();
      document.getElementById('name').dispatchEvent(new Event('change'));
    } else {
      document.getElementById('status').textContent = 'Failed to add product.';
    }
  } catch (err) {
    console.error('Error:', err);
    document.getElementById('status').textContent = 'Error adding product.';
  }
});
