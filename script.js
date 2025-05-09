// HOVER EFFECT
// ------------------
document.querySelectorAll('.pop-hover').forEach(button => {
  button.addEventListener('mouseover', () => {
    button.style.transform = 'scale(1.1)';
  });
  button.addEventListener('mouseout', () => {
    button.style.transform = 'scale(1)';
  });
});

// PRODUCT IMAGE LOGIC
// ------------------
const images = ["images/velour_shirt_front.png", "images/velour_shirt_back.png"];
let current = 0;
function showImage(index) {
  document.getElementById('productImage').src = images[index];
}
function prevImage() {
  current = (current - 1 + images.length) % images.length;
  showImage(current);
}
function nextImage() {
  current = (current + 1) % images.length;
  showImage(current);
}

// QUANTITY ADJUSTMENT
// ------------------
function increaseQty() {
  const qty = document.getElementById("qty");
  qty.innerText = parseInt(qty.innerText) + 1;
}
function decreaseQty() {
  const qty = document.getElementById("qty");
  const value = parseInt(qty.innerText);
  if (value > 1) qty.innerText = value - 1;
}

// SORTING BY CATEGORY
// ------------------
document.querySelectorAll('.sort-sidebar a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const filter = this.getAttribute('data-filter');
    document.querySelectorAll('.sort-sidebar a').forEach(a => a.classList.remove('active'));
    this.classList.add('active');
    document.querySelectorAll('.item').forEach(item => {
      const category = item.getAttribute('data-category');
      item.style.display = (filter === 'ALL' || category.includes(filter)) ? 'flex' : 'none';
    });
  });
});

// INVENTORY OBJECT
// ------------------
const inventory = {
  "Black Star Hoodie": {},
  "Grey Hoodie": {},
  "Camo Hoodie": {},
  "Cream Hoodie": {},
  "Leather Jacket": {},
  "Cropped Herringbone Jacket": {},
  "Suede Jacket": {},
  "Velour Classic Tee": {},
  "Black Velour Tee": {},
  "Ape Velour Tee": {},
  "Highwaist Shorts": {},
  "Jean Shorts": {},
  "Brown Denim Shorts": {},
  "Baggy Velour Tee": {},
  "Velour Crop Top": {},
  "Velour Jeans": {},
  "Beige Sweats": {},
  "Violet Sweats": {},
  "Logo Trucker Hat": {},
  "Logo Beanie": {}
};

for (let product in inventory) {
  inventory[product] = { S: 5, M: 5, L: 5, XL: 5, "2XL": 5 };
}

// ADD TO CART
// ------------------
function addToCart() {
  const name = document.querySelector('.details h1')?.innerText || "Unknown Product";
  const priceText = document.querySelector('.details .price')?.innerText || "$0";
  const price = parseFloat(priceText.replace('$', '')) || 0;
  const image = document.getElementById('productImage')?.getAttribute('src') || "images/default.png";
  const color = document.getElementById('selectedColor')?.value || "N/A";
  const size = document.getElementById('selectedSize')?.value || "N/A";
  const quantity = parseInt(document.getElementById('qty')?.innerText || "1");

  if (!inventory[name] || !inventory[name][size] || inventory[name][size] < quantity) {
    alert("Sorry, not enough stock for this size.");
    return;
  }

  inventory[name][size] -= quantity;

  const product = { name, price, image, color, size, quantity };
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Item added to cart.");
}

// LOAD CART
// ------------------
function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cartContainer");
  let total = 0;

  if (!container) return;

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-details">
        <p><strong>${item.name}</strong></p>
        <p>Color: ${item.color}</p>
        <p>Size: ${item.size}</p>
        <p>Qty: ${item.quantity}</p>
        <p>$${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <button onclick="removeItem(${index})" class="remove-btn">Remove</button>
    `;
    container.appendChild(itemDiv);
    total += item.price * item.quantity;
  });

  const summary = document.getElementById("cartSummary");
  if (summary) {
    summary.innerHTML = `
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      <a href="checkout.html"><button class="checkout-btn">Proceed to Checkout</button></a>
    `;
  }
}

if (window.location.pathname.includes("checkout.html")) {
  document.addEventListener("DOMContentLoaded", loadCheckoutCart);
  function loadCheckoutCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartBox = document.getElementById("checkoutCart");
    cartBox.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
      cartBox.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }
  
  cart.forEach(item => {
    total += item.price * item.quantity;
    const itemHTML = `
    <div class="checkout-summary-item">
    <img src="${item.image}" alt="${item.name}">
    <div>
    <strong>${item.name}</strong><br>
    ${item.color} | ${item.size} | Qty: ${item.quantity}<br>
    $${(item.price * item.quantity).toFixed(2)}
    </div>
    </div>
    `;
    cartBox.innerHTML += itemHTML;
  });
  const totalHTML = `<p class="summary-total">Total: $${total.toFixed(2)}</p>`;
  cartBox.innerHTML += totalHTML;
}
}
// REMOVE ITEM
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload();
}

// INIT LOAD

function luhnCheck(cardNumber) {
  let sum = 0;
  let shouldDouble = false;
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function copyShipping() {
  const isChecked = document.getElementById("sameAsShipping").checked;
  const billingSection = document.getElementById("billingSection");
  
  if (isChecked) {
    billingSection.style.display = "none";
    document.getElementById("billName").value = document.getElementById("shipName").value;
    document.getElementById("billAddress").value = document.getElementById("shipAddress").value;
    document.getElementById("billCity").value = document.getElementById("shipCity").value;
    document.getElementById("billState").value = document.getElementById("shipState").value;
    document.getElementById("billZip").value = document.getElementById("shipZip").value;
  } else {
    billingSection.style.display = "block";
  }
}

function placeOrder() {
  const requiredShippingFields = [
    "firstName", "lastName", "address", "city", "state", "zip", "phone", "cardNumber", "expiry", "cvv", "cardName"
  ];

  for (let id of requiredShippingFields) {
    const el = document.getElementById(id);
    if (el && !el.value.trim()) {
      alert("Please fill out all required fields.");
      return;
    }
  }

  if (!document.getElementById("sameAsShipping").checked) {
    const billingFields = ["billName", "billAddress", "billCity", "billState", "billZip"];
    for (let id of billingFields) {
      const el = document.getElementById(id);
      if (el && !el.value.trim()) {
        alert("Please fill in all billing fields.");
        return;
      }
    }
  }

  const card = document.getElementById("cardNumber").value.replace(/\s+/g, '');
  if (!/^\d{13,19}$/.test(card)) {
    alert("Invalid card number.");
    return;
  }

  alert("Payment successful!");
  localStorage.removeItem("cart");
  const fullName = document.getElementById("firstName").value + " " + document.getElementById("lastName").value;
  localStorage.setItem("customerName", fullName);
  localStorage.setItem("confirmedOrder", localStorage.getItem("cart"));
  let allOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
  allOrders.push({ customer: fullName, order: cart, date: new Date().toLocaleString() });
  localStorage.setItem("orderHistory", JSON.stringify(allOrders));

  window.location.href = "confirm.html";
}

function toggleBilling() {
  const billingSection = document.getElementById("billingSection");
  if (document.getElementById("sameAsShipping").checked) {
    billingSection.style.display = "none";
  } else {
    billingSection.style.display = "block";
  }
}
if (window.location.pathname.includes("confirm.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("sameAsShipping");
    if (checkbox) checkbox.addEventListener("change", toggleBilling);
    loadCheckoutCart();
    toggleBilling();
});
document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("customerName");
  const email = localStorage.getItem("customerEmail");

  if (name) {
    document.getElementById("thanksMsg").textContent = `Thank You, ${name}, for Your Order!`;
  }

  if (email) {
    document.getElementById("emailMsg").textContent = `We will contact you with a confirmation email at: ${email}`;
  }

  const orderSummary = document.getElementById("orderSummary");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `<p><strong>${item.name}</strong> (${item.size}, ${item.color}) × ${item.quantity}</p>`;
    orderSummary.appendChild(div);
  });

  localStorage.removeItem("cart"); // Clear cart after order summary is shown
});
}