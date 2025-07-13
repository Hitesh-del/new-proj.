const products = [
  {
    id: 1,
    name: "Lettuce",
    sku: "VGT001",
    quantity: 150,
    description: "Fresh organic lettuce",
    category: "vegetables",
    supplier: "Green Valley Farms",
    unit: "kg",
    price: 30,
    expiry: "2023-12-30",
    location: "Aisle 3, Shelf 2",
    batch: "BATCH-20231001",
    reorderLevel: 50,
    notes: "Store in cool, dry place",
    added: new Date(),
    // image: ".vscode/images/Lettuce-img.webp",
    image: "lettuce-img.jpeg",
  },
  {
    id: 2,
    name: "Milk",
    sku: "DAR001",
    quantity: 30,
    description: "Pasteurized whole milk",
    category: "dairy",
    supplier: "Happy Cows Dairy",
    unit: "liters",
    price: 29,
    expiry: "2023-11-15",
    location: "Refrigerator, Section A",
    batch: "BATCH-20231015",
    reorderLevel: 20,
    notes: "Keep refrigerated",
    added: new Date(),
    // image: ".vscode/images/milk-image.jpg",
    image: "milk-img.webp",
  },
  {
    id: 3,
    name: "Basil",
    sku: "HERB001",
    quantity: 5,
    description: "Fresh basil leaves",
    category: "herbs",
    supplier: "Herb Garden Co.",
    unit: "pieces",
    price: 1.99,
    expiry: "2023-11-10",
    location: "Aisle 2, Shelf 1",
    batch: "BATCH-20231005",
    reorderLevel: 10,
    notes: "Use within 3 days of purchase",
    added: new Date(),
    // image: ".vscode/images/basil1-img.jpg",
    image:"basil-img.jpg",
  },
  {
    id: 4,
    name: "Apple",
    sku: "FRU001",
    quantity: 200,
    description: "Red delicious apples",
    category: "fruits",
    supplier: "Apple Orchards Inc.",
    unit: "kg",
    price: 4.99,
    expiry: "2023-12-15",
    location: "Aisle 4, Shelf 3",
    batch: "BATCH-20231010",
    reorderLevel: 100,
    notes: "Store in cool, dry place",
    added: new Date(),
    // image: ".vscode/images/apple-img.avif",
    image:"apple-img.jpg",
  },
  {
    id: 5,
    name: "Cheese",
    sku: "DAR002",
    quantity: 10,
    description: "Cheddar cheese blocks",
    category: "dairy",
    supplier: "Cheese Makers Co.",
    unit: "pieces",
    price: 5.99,
    expiry: "2023-11-20",
    location: "Refrigerator, Section B",
    batch: "BATCH-20231018",
    reorderLevel: 15,
    notes: "Store in refrigerator",
    added: new Date(),
    // image: ".vscode/images/cheese-img.jpg",
    image:"cheese-img.jpg",
  },
  {
    id: 6,
    name: "Tomato",
    sku: "VGT002",
    quantity: 0,
    description: "Ripe red tomatoes",
    category: "vegetables",
    supplier: "Tomato Farms Ltd.",
    unit: "kg",
    price: 3.49,
    expiry: "2023-11-12",
    location: "Aisle 3, Shelf 1",
    batch: "BATCH-20231012",
    reorderLevel: 30,
    notes: "Use within 5 days",
    added: new Date(),
    // image: ".vscode/images/tomato-img.jpg"
    image:"tomato-img.jpg",
  }
];

const lowStockThreshold = 10;
let currentProductId = null;

const content = document.getElementById('content');
const navButtons = document.querySelectorAll('.nav-btn');
const addProductBtn = document.getElementById('add-product-btn');
const editModal = document.getElementById('edit-modal');
const addModal = document.getElementById('add-modal');
const closeModalBtn = document.getElementById('close-modal');
const closeAddModalBtn = document.getElementById('close-add-modal');

document.addEventListener('DOMContentLoaded', () => {
  loadPage('inventory');
  navButtons.forEach(btn => btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadPage(btn.dataset.page);
  }));

  addProductBtn.addEventListener('click', () => {
    document.getElementById('file-name').textContent = '';
    document.getElementById('modal-add-product-form').reset(); // Clear form on open
    addModal.style.display = 'flex';
  });

  closeModalBtn.addEventListener('click', () => editModal.style.display = 'none');
  closeAddModalBtn.addEventListener('click', () => addModal.style.display = 'none');

  window.addEventListener('click', e => {
    if (e.target === editModal) editModal.style.display = 'none';
    if (e.target === addModal) addModal.style.display = 'none';
  });

  document.getElementById('edit-product-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('edit-name').value.trim();
    const sku = document.getElementById('edit-sku').value.trim();
    const category = document.getElementById('edit-category').value;
    const supplier = document.getElementById('edit-supplier').value.trim();
    const unit = document.getElementById('edit-unit').value;
    const qty = parseInt(document.getElementById('edit-stock').value);
    const price = parseFloat(document.getElementById('edit-price').value);
    const expiry = document.getElementById('edit-expiry').value;
    const location = document.getElementById('edit-location').value.trim();
    const batch = document.getElementById('edit-batch').value.trim();
    const reorderLevel = parseInt(document.getElementById('edit-reorder').value);
    const notes = document.getElementById('edit-notes').value.trim();
    const imageFile = document.getElementById('edit-image').files[0];


    if (name && sku && qty >= 0 && price >= 0) {
      const exists = products.some(p => p.sku === sku && p.id !== currentProductId);
      if (exists) {
        alert('SKU already exists!');
        return;
      }

      const idx = products.findIndex(p => p.id === currentProductId);
      if (idx !== -1) {
        products[idx].name = name;
        products[idx].sku = sku;
        products[idx].category = category;
        products[idx].supplier = supplier;
        products[idx].unit = unit;
        products[idx].quantity = qty;
        products[idx].price = price;
        products[idx].expiry = expiry;
        products[idx].location = location;
        products[idx].batch = batch;
        products[idx].reorderLevel = reorderLevel;
        products[idx].notes = notes;

        if (imageFile) {
          products[idx].image = URL.createObjectURL(imageFile);
        }

        editModal.style.display = 'none';
        loadPage('inventory');
        showNotification('Product updated successfully', 'success');
      }
    } else {
      showNotification('Fill all required fields correctly', 'error');
    }
  });

  document.getElementById('modal-image').addEventListener('change', function () {
    const fileName = this.files[0]?.name || '';
    document.getElementById('file-name').textContent = fileName;
  });

  document.getElementById('edit-image').addEventListener('change', function () {
    const fileName = this.files[0]?.name || '';
    document.getElementById('edit-file-name').textContent = fileName;
  });

  document.getElementById('modal-add-product-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('modal-product-name').value.trim();
    const sku = document.getElementById('modal-sku').value.trim();
    const category = document.getElementById('modal-category').value;
    const supplier = document.getElementById('modal-supplier').value.trim();
    const unit = document.getElementById('modal-unit').value;
    const qty = parseInt(document.getElementById('modal-stock').value);
    const price = parseFloat(document.getElementById('modal-price').value);
    const expiry = document.getElementById('modal-expiry').value;
    const location = document.getElementById('modal-location').value.trim();
    const batch = document.getElementById('modal-batch').value.trim();
    const reorderLevel = parseInt(document.getElementById('modal-reorder').value);
    const notes = document.getElementById('modal-notes').value.trim();
    const imageFile = document.getElementById('modal-image').files[0];


    if (name && sku && qty >= 0 && price >= 0) {
      const exists = products.some(p => p.sku === sku);
      if (exists) {
        alert('SKU already exists!');
        return;
      }

      const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
      const image = imageFile ?
        URL.createObjectURL(imageFile) :
        `https://picsum.photos/seed/${name.replace(/\s+/g, '')}/300/200.jpg`;

      products.push({
        id: newId,
        name,
        sku,
        quantity: qty,
        description: notes || "New product",
        category,
        supplier,
        unit,
        price,
        expiry,
        location,
        batch,
        reorderLevel,
        notes,
        added: new Date(),
        image
      });

      addModal.style.display = 'none';
      loadPage('inventory');
      showNotification('Product added successfully!', 'success');
      document.getElementById('modal-add-product-form').reset();
    } else {
      showNotification('Fill all required fields correctly', 'error');
    }
  });
});

function loadPage(page) {
  content.innerHTML = '';
  if (page === 'inventory') {
    content.innerHTML = `
          <div class="inventory-info">
            <h3>Inventory Overview</h3>
            <p>Products low in stock are highlighted. Manage them easily.</p>
          </div>
          <div class="search-container">
            <i class="fas fa-search"></i>
            <input type="text" id="search" placeholder="Search products...">
          </div>
          <h2 class="section-title">Product Inventory</h2>
          <div class="inventory-grid" id="inventory-grid"></div>
        `;
    renderInventory();

    document.getElementById('search').addEventListener('input', e => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.sku.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );

      const grid = document.getElementById('inventory-grid');
      grid.innerHTML = '';

      if (filteredProducts.length === 0) {
        grid.innerHTML = '<p class="no-results">No products found matching your search.</p>';
        return;
      }

      filteredProducts.forEach(renderProductCard);
    });
  }
  else if (page === 'add-product') {
    content.innerHTML = `
          <div class="inventory-info">
            <h3>Add New Product</h3>
            <p>Fill the form to add products.</p>
          </div>
          <h2 class="section-title">Add New Product</h2>
          <div class="form-container" style="max-height: calc(100vh - 250px); overflow-y: auto; padding-right: 15px;">
            <form id="add-product-form">
              <div class="form-group">
                <label class="form-label">Product Name</label>
                <input class="form-input" id="product-name" required>
              </div>
              <div class="form-group">
                <label class="form-label">SKU</label>
                <input class="form-input" id="sku" required>
              </div>
              <div class="form-group">
                <label class="form-label">Category</label>
                <select class="form-input" id="category">
                  <option value="vegetables">Vegetables</option>
                  <option value="herbs">Herbs</option>
                  <option value="dairy">Dairy</option>
                  <option value="fruits">Fruits</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Supplier Name</label>
                <input class="form-input" id="supplier">
              </div>
              <div class="form-group">
                <label class="form-label">Unit of Measure</label>
                <select class="form-input" id="unit-of-measure">
                  <option value="kg">Kg</option>
                  <option value="pieces">Pieces</option>
                  <option value="box">Box</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Current Stock Quantity</label>
                <input type="number" class="form-input" id="current-stock" min="0">
              </div>
              <div class="form-group">
                <label class="form-label">Quantity to Add (This will add to current stock or be initial if new)</label>
                <input type="number" class="form-input" id="update-quantity" required value="0">
              </div>
              <div class="form-group">
                <label class="form-label">Price Per Unit</label>
                <input type="number" class="form-input" id="price-per-unit" step="0.01" required>
              </div>
              <div class="form-group">
                <label class="form-label">Expiry Date</label>
                <input type="date" class="form-input" id="expiry-date">
              </div>
              <div class="form-group">
                <label class="form-label">Storage Location</label>
                <input class="form-input" id="storage-location">
              </div>
              <div class="form-group">
                <label class="form-label">Batch Number</label>
                <input class="form-input" id="batch-number">
              </div>
              <div class="form-group">
                <label class="form-label">Reorder Level</label>
                <input type="number" class="form-input" id="reorder-level">
              </div>
              <div class="form-group">
                <label class="form-label">Additional Notes</label>
                <textarea class="form-input" id="notes"></textarea>
              </div>
              <div class="form-group">
                <label class="form-label" for="product-image">Upload Product Image</label>
                <div class="file-upload">
                    <label class="file-upload-btn">
                        <i class="fas fa-upload"></i> Choose File
                        <input type="file" id="product-image" name="product-image" accept="image/*">
                    </label>
                </div>
                <div class="file-name" id="add-page-file-name"></div>
              </div>
              <button class="submit-btn" type="submit">Save Product</button>
            </form>
            <div id="feedback" class="feedback"></div>
          </div>
        `;

    document.getElementById('product-image').addEventListener('change', function () {
      const fileName = this.files[0]?.name || '';
      document.getElementById('add-page-file-name').textContent = fileName;
    });

    const addProductForm = document.getElementById('add-product-form');
    const productNameInput = document.getElementById('product-name');
    const skuInput = document.getElementById('sku');
    const currentStockInput = document.getElementById('current-stock');


    // Function to populate form fields based on product data
    const populateFormFields = (product) => {
      if (product) {
        productNameInput.value = product.name; // Ensure product name is populated
        skuInput.value = product.sku;
        document.getElementById('category').value = product.category;
        document.getElementById('supplier').value = product.supplier;
        document.getElementById('unit-of-measure').value = product.unit;
        currentStockInput.value = product.quantity;
        document.getElementById('price-per-unit').value = product.price;
        document.getElementById('expiry-date').value = product.expiry;
        document.getElementById('storage-location').value = product.location;
        document.getElementById('batch-number').value = product.batch;
        document.getElementById('reorder-level').value = product.reorderLevel;
        document.getElementById('notes').value = product.notes;
      } else {
        // Clear specific fields if product not found, keep name/sku for new entry
        document.getElementById('category').value = 'vegetables';
        document.getElementById('supplier').value = '';
        document.getElementById('unit-of-measure').value = 'kg';
        currentStockInput.value = ''; // Clear current stock for new products
        document.getElementById('price-per-unit').value = '';
        document.getElementById('expiry-date').value = '';
        document.getElementById('storage-location').value = '';
        document.getElementById('batch-number').value = '';
        document.getElementById('reorder-level').value = '';
        document.getElementById('notes').value = '';
      }
    };

    // Populate form fields when product name is entered
    productNameInput.addEventListener('blur', () => {
      const productName = productNameInput.value.trim();
      const product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());
      populateFormFields(product);
    });

    // Also populate when SKU is entered (in case name is ambiguous or not entered first)
    skuInput.addEventListener('blur', () => {
      const sku = skuInput.value.trim();
      const product = products.find(p => p.sku.toLowerCase() === sku.toLowerCase());
      if (product) {
        productNameInput.value = product.name; // Fill name if SKU is found
      }
      populateFormFields(product);
    });


    addProductForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('product-name').value.trim();
      const sku = document.getElementById('sku').value.trim();
      const category = document.getElementById('category').value;
      const supplier = document.getElementById('supplier').value.trim();
      const unit = document.getElementById('unit-of-measure').value;
      const currentStock = parseInt(document.getElementById('current-stock').value || 0); // Get current stock, default to 0 if empty
      const updateQuantity = parseInt(document.getElementById('update-quantity').value); // This is the quantity to add
      const price = parseFloat(document.getElementById('price-per-unit').value);
      const expiry = document.getElementById('expiry-date').value;
      const location = document.getElementById('storage-location').value.trim();
      const batch = document.getElementById('batch-number').value.trim();
      const reorderLevel = parseInt(document.getElementById('reorder-level').value);
      const notes = document.getElementById('notes').value.trim();
      const imageFile = document.getElementById('product-image').files[0];

      if (name && sku && !isNaN(updateQuantity) && !isNaN(price)) {
        const existingProduct = products.find(p => p.sku === sku);

        if (existingProduct) {
          // If product exists, update its quantity
          existingProduct.quantity = currentStock + updateQuantity; // Use enabled current stock + update quantity
          existingProduct.price = price; // Update price as well
          existingProduct.expiry = expiry;
          existingProduct.location = location;
          existingProduct.batch = batch;
          existingProduct.reorderLevel = reorderLevel;
          existingProduct.notes = notes;
          if (imageFile) {
            existingProduct.image = URL.createObjectURL(imageFile);
          }
          document.getElementById('feedback').textContent = `Updated ${name} to ${existingProduct.quantity} units.`;
        } else {
          // If product does not exist, add as new product
          const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
          const image = imageFile ?
            URL.createObjectURL(imageFile) :
            `https://picsum.photos/seed/${name.replace(/\s+/g, '')}/300/200.jpg`;

          products.push({
            id: newId,
            name,
            sku,
            quantity: currentStock + updateQuantity, // Initial quantity for new product
            description: notes || "New product",
            category,
            supplier,
            unit,
            price,
            expiry,
            location,
            batch,
            reorderLevel,
            notes,
            added: new Date(),
            image
          });
          document.getElementById('feedback').textContent = `${name} added successfully!`;
        }

        document.getElementById('feedback').className = 'feedback success';

        setTimeout(() => {
          document.querySelector('[data-page="inventory"]').click();
        }, 1500);
      } else {
        document.getElementById('feedback').textContent = 'Fill all required fields correctly.';
        document.getElementById('feedback').className = 'feedback error';
      }
    });
  }
  else if (page === 'update-product') {
    content.innerHTML = `
          <div class="inventory-info">
            <h3>Update Product Stock</h3>
            <p>Use this form to update stock levels for existing products.</p>
          </div>
          <h2 class="section-title">Update Inventory Stock</h2>
          <div class="form-container">
            <form id="update-form">
              <div class="form-group">
                <label class="form-label">Product SKU</label>
                <input class="form-input" id="update-sku-search" required list="product-skus">
                <datalist id="product-skus"></datalist>
              </div>
              <div class="form-group">
                <label class="form-label">Product Name</label>
                <input class="form-input" id="item-name" >
              </div>
              <div class="form-group">
                <label class="form-label">Current Stock Quantity</label>
                <input type="number" class="form-input" id="current-stock" min="0">
              </div>
              <div class="form-group">
                <label class="form-label">Quantity to Add/Remove</label>
                <input type="number" class="form-input" id="update-quantity" required>
              </div>
              <div class="form-group">
                <label class="form-label">Price Per Unit</label>
                <input type="number" class="form-input" id="price-per-unit" step="0.01">
              </div>
              <div class="form-group">
                <label class="form-label">Expiry Date</label>
                <input type="date" class="form-input" id="expiry-date">
              </div>
              <div class="form-group">
                <label class="form-label">Storage Location</label>
                <input class="form-input" id="storage-location">
              </div>
              <div class="form-group">
                <label class="form-label">Batch Number</label>
                <input class="form-input" id="batch-number">
              </div>
              <div class="form-group">
                <label class="form-label">Reorder Level</label>
                <input type="number" class="form-input" id="reorder-level">
              </div>
              <div class="form-group">
                    <label class="form-label" for="update-image">Change Product Image</label>
                    <div class="file-upload">
                        <label class="file-upload-btn">
                            <i class="fas fa-upload"></i> Choose File
                            <input type="file" id="update-image" name="update-image" accept="image/*">
                        </label>
                    </div>
                    <div class="file-name" id="update-file-name"></div>
                </div>
              <button class="submit-btn" type="submit">Update Stock</button>
            </form>
            <div id="message" class="feedback"></div>
          </div>
        `;

    const updateSkuSearch = document.getElementById('update-sku-search');
    const productSkusDatalist = document.getElementById('product-skus');
    products.forEach(p => {
      const option = document.createElement('option');
      option.value = p.sku;
      productSkusDatalist.appendChild(option);
    });

    document.getElementById('update-image').addEventListener('change', function () {
      const fileName = this.files[0]?.name || '';
      document.getElementById('update-file-name').textContent = fileName;
    });

    updateSkuSearch.addEventListener('input', () => {
      const sku = updateSkuSearch.value.trim();
      const product = products.find(p => p.sku === sku);
      if (product) {
        document.getElementById('item-name').value = product.name;
        document.getElementById('current-stock').value = product.quantity;
        document.getElementById('price-per-unit').value = product.price;
        document.getElementById('expiry-date').value = product.expiry;
        document.getElementById('storage-location').value = product.location;
        document.getElementById('batch-number').value = product.batch;
        document.getElementById('reorder-level').value = product.reorderLevel;
        document.getElementById('update-quantity').value = 0; // Reset update quantity
        document.getElementById('update-file-name').textContent = ''; // Clear previous file name
      } else {
        document.getElementById('item-name').value = '';
        document.getElementById('current-stock').value = '';
        document.getElementById('price-per-unit').value = '';
        document.getElementById('expiry-date').value = '';
        document.getElementById('storage-location').value = '';
        document.getElementById('batch-number').value = '';
        document.getElementById('reorder-level').value = '';
        document.getElementById('update-quantity').value = '';
        document.getElementById('update-file-name').textContent = '';
      }
    });

    document.getElementById('update-form').addEventListener('submit', e => {
      e.preventDefault();
      const sku = document.getElementById('update-sku-search').value.trim();
      const name = document.getElementById('item-name').value.trim(); // Get the enabled product name
      const currentStock = parseInt(document.getElementById('current-stock').value || 0); // Get the enabled current stock
      const updateQuantity = parseInt(document.getElementById('update-quantity').value);
      const price = parseFloat(document.getElementById('price-per-unit').value);
      const expiry = document.getElementById('expiry-date').value;
      const location = document.getElementById('storage-location').value.trim();
      const batch = document.getElementById('batch-number').value.trim();
      const reorderLevel = parseInt(document.getElementById('reorder-level').value);
      const imageFile = document.getElementById('update-image').files[0];


      if (sku && name && !isNaN(currentStock) && !isNaN(updateQuantity) && !isNaN(price)) {
        const product = products.find(p => p.sku === sku);

        if (product) {
          product.name = name; // Update product name
          product.quantity = currentStock + updateQuantity; // Use enabled current stock + update quantity
          product.price = price;
          if (expiry) product.expiry = expiry;
          if (location) product.location = location;
          if (batch) product.batch = batch;
          if (!isNaN(reorderLevel)) product.reorderLevel = reorderLevel;
          if (imageFile) {
            product.image = URL.createObjectURL(imageFile);
          }

          document.getElementById('message').textContent = `Updated ${product.name} to ${product.quantity} units.`;
          document.getElementById('message').className = 'feedback success';

          setTimeout(() => {
            document.querySelector('[data-page="inventory"]').click();
          }, 1500);
        } else {
          document.getElementById('message').textContent = 'Product not found.';
          document.getElementById('message').className = 'feedback error';
        }
      } else {
        document.getElementById('message').textContent = 'Fill all required fields correctly.';
        document.getElementById('message').className = 'feedback error';
      }
    });
  }
}

function renderInventory() {
  const grid = document.getElementById('inventory-grid');
  grid.innerHTML = '';

  products.forEach(product => {
    const isLowStock = product.quantity < lowStockThreshold;
    const isOutOfStock = product.quantity === 0;
    const isNearExpiry = product.expiry && (new Date(product.expiry).getTime() - new Date().getTime()) < 7 * 24 * 60 * 60 * 1000; // Less than 7 days
    const isBelowReorder = product.quantity < product.reorderLevel;

    const card = document.createElement('div');
    card.className = `product-card ${isLowStock || isOutOfStock ? 'low-stock' : ''}`;
    card.innerHTML = `
            <div class="product-header">
              <div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-sku">SKU: ${product.sku}</p>
                <p class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
              </div>
              <i class="fas fa-box" style="font-size:24px; color:var(--primary)"></i>
            </div>
            <img src="${product.image}" alt="${product.name}">
            <p>${product.description}</p>
            <p class="product-quantity ${isLowStock || isOutOfStock ? 'low-stock' : ''}">${product.quantity} ${product.unit} in stock</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <p class="storage-location">Location: ${product.location}</p>
            <p class="batch-number">Batch: ${product.batch}</p>
            ${isNearExpiry ? `<p class="expiry-warning"><i class="fas fa-exclamation-circle"></i> Expires soon: ${product.expiry}</p>` : ''}
            ${isBelowReorder ? `<p class="expiry-warning"><i class="fas fa-exclamation-circle"></i> Below reorder level: ${product.reorderLevel}</p>` : ''}
            <div class="product-actions">
              <button class="action-btn edit-btn" data-id="${product.id}" title="Edit Product">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete-btn" data-id="${product.id}" title="Delete Product">
                <i class="fas fa-trash-can"></i>
              </button>
            </div>
          `;
    grid.appendChild(card);

    card.querySelector('.edit-btn').addEventListener('click', () => {
      currentProductId = product.id;
      document.getElementById('edit-name').value = product.name;
      document.getElementById('edit-sku').value = product.sku;
      document.getElementById('edit-category').value = product.category;
      document.getElementById('edit-supplier').value = product.supplier;
      document.getElementById('edit-unit').value = product.unit;
      document.getElementById('edit-stock').value = product.quantity;
      document.getElementById('edit-price').value = product.price;
      document.getElementById('edit-expiry').value = product.expiry;
      document.getElementById('edit-location').value = product.location;
      document.getElementById('edit-batch').value = product.batch;
      document.getElementById('edit-reorder').value = product.reorderLevel;
      document.getElementById('edit-notes').value = product.notes;
      document.getElementById('edit-file-name').textContent = ''; // Clear previous file name


      editModal.style.display = 'flex';
    });

    card.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm(`Delete ${product.name}?`)) {
        const idx = products.findIndex(p => p.id === product.id);
        if (idx > -1) products.splice(idx, 1);
        renderInventory();
        showNotification(`${product.name} deleted.`, 'success');
      }
    });
  });

  // summary
  const total = products.length;
  const lowCount = products.filter(p => p.quantity < lowStockThreshold).length;
  const outOfStockCount = products.filter(p => p.quantity === 0).length;

  const summary = document.createElement('div');
  summary.className = 'inventory-summary';
  summary.innerHTML = `
            <div>Total Products <span>${total}</span></div>
            <div>Low Stock Products <span>${lowCount}</span></div>
            <div>Out of Stock <span>${outOfStockCount}</span></div>
          `;
  content.appendChild(summary);
}

// Helper function to render a single product card (used in search)
function renderProductCard(product) {
  const grid = document.getElementById('inventory-grid');
  const isLowStock = product.quantity < lowStockThreshold;
  const isOutOfStock = product.quantity === 0;
  const isNearExpiry = product.expiry && (new Date(product.expiry).getTime() - new Date().getTime()) < 7 * 24 * 60 * 60 * 1000;
  const isBelowReorder = product.quantity < product.reorderLevel;

  const card = document.createElement('div');
  card.className = `product-card ${isLowStock || isOutOfStock ? 'low-stock' : ''}`;
  card.innerHTML = `
            <div class="product-header">
              <div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-sku">SKU: ${product.sku}</p>
                <p class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
              </div>
              <i class="fas fa-box" style="font-size:24px; color:var(--primary)"></i>
            </div>
            <img src="${product.image}" alt="${product.name}">
            <p>${product.description}</p>
            <p class="product-quantity ${isLowStock || isOutOfStock ? 'low-stock' : ''}">${product.quantity} ${product.unit} in stock</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <p class="storage-location">Location: ${product.location}</p>
            <p class="batch-number">Batch: ${product.batch}</p>
            ${isNearExpiry ? `<p class="expiry-warning"><i class="fas fa-exclamation-circle"></i> Expires soon: ${product.expiry}</p>` : ''}
            ${isBelowReorder ? `<p class="expiry-warning"><i class="fas fa-exclamation-circle"></i> Below reorder level: ${product.reorderLevel}</p>` : ''}
            <div class="product-actions">
              <button class="action-btn edit-btn" data-id="${product.id}" title="Edit Product">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete-btn" data-id="${product.id}" title="Delete Product">
                <i class="fas fa-trash-can"></i>
              </button>
            </div>
          `;
  grid.appendChild(card);

  card.querySelector('.edit-btn').addEventListener('click', () => {
    currentProductId = product.id;
    document.getElementById('edit-name').value = product.name;
    document.getElementById('edit-sku').value = product.sku;
    document.getElementById('edit-category').value = product.category;
    document.getElementById('edit-supplier').value = product.supplier;
    document.getElementById('edit-unit').value = product.unit;
    document.getElementById('edit-stock').value = product.quantity;
    document.getElementById('edit-price').value = product.price;
    document.getElementById('edit-expiry').value = product.expiry;
    document.getElementById('edit-location').value = product.location;
    document.getElementById('edit-batch').value = product.batch;
    document.getElementById('edit-reorder').value = product.reorderLevel;
    document.getElementById('edit-notes').value = product.notes;
    document.getElementById('edit-file-name').textContent = '';

    editModal.style.display = 'flex';
  });

  card.querySelector('.delete-btn').addEventListener('click', () => {
    if (confirm(`Delete ${product.name}?`)) {
      const idx = products.findIndex(p => p.id === product.id);
      if (idx > -1) products.splice(idx, 1);
      renderInventory();
      showNotification(`${product.name} deleted.`, 'success');
    }
  });
}


function showNotification(msg, type) {
  const n = document.createElement('div');
  n.className = `feedback ${type}`;
  n.style.position = 'fixed'; n.style.bottom = '20px'; n.style.right = '20px';
  n.style.zIndex = '1000'; n.style.maxWidth = '300px'; n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(() => {
    n.style.opacity = '0'; n.style.transform = 'translateY(10px)'; n.style.transition = 'all 0.5s';
    setTimeout(() => document.body.removeChild(n), 500);
  }, 3000);
}