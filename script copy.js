// Hover effect
document.querySelectorAll('.pop-hover').forEach(button => {
  button.addEventListener('mouseover', () => {
    button.style.transform = 'scale(1.1)';
  });
  button.addEventListener('mouseout', () => {
    button.style.transform = 'scale(1)';
  });
});

// ---------- IMAGE SLIDER (AUTO FRONT/BACK) ------------
document.addEventListener("DOMContentLoaded", () => {
  const productImage = document.getElementById("productImage");

  if (productImage) {
    const originalSrc = productImage.getAttribute("src");
    const baseName = originalSrc.replace("_front.png", "");
    const images = [`${baseName}_front.png`, `${baseName}_back.png`];
    let current = 0;

    window.showImage = function(index) {
      productImage.src = images[index];
    };

    window.nextImage = function() {
      current = (current + 1) % images.length;
      showImage(current);
    };

    window.prevImage = function() {
      current = (current - 1 + images.length) % images.length;
      showImage(current);
    };
  }
});

// ---------- ADD TO CART ----------
function addToCart() {
  const name = document.querySelector('.details h1')?.innerText || "Unknown Product";
  const priceText = document.querySelector('.details .price')?.innerText || "$0";
  const price = parseFloat(priceText.replace('$', '')) || 0;
  const image = document.getElementById('productImage')?.getAttribute('src') || "images/default.png";
  const color = document.getElementById('selectedColor')?.value || "N/A";
  const size = document.getElementById('selectedSize')?.value || "N/A";
  const quantity = parseInt(document.getElementById('qty')?.innerText || "1");

  const product = { name, price, image, color, size, quantity };

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ---------- QUANTITY CONTROLS ----------
function increaseQty() {
  let qty = document.getElementById("qty");
  qty.innerText = parseInt(qty.innerText) + 1;
}

function decreaseQty() {
  let qty = document.getElementById("qty");
  let value = parseInt(qty.innerText);
  if (value > 1) qty.innerText = value - 1;
}

// ---------- SIDEBAR FILTERING ----------
document.querySelectorAll('.sort-sidebar a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    const filter = this.getAttribute('data-filter');
    document.querySelectorAll('.sort-sidebar a').forEach(a => a.classList.remove('active'));
    this.classList.add('active');

    document.querySelectorAll('.item').forEach(item => {
      const category = item.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ---------- CHECKOUT ----------
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("checkoutForm")) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orderSummary = document.getElementById("orderSummary");

    let total = 0;
    if (cart.length === 0) {
      orderSummary.innerHTML = "<p>Your cart is empty.</p>";
    } else {
      cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const div = document.createElement("div");
        div.innerHTML = `<p><strong>${item.name}</strong> (${item.size}, ${item.color}) x${item.quantity} — $${subtotal.toFixed(2)}</p>`;
        orderSummary.appendChild(div);
      });

      const totalDiv = document.createElement("div");
      totalDiv.innerHTML = `<p><strong>Total:</strong> $${total.toFixed(2)}</p>`;
      orderSummary.appendChild(totalDiv);
    }

    document.getElementById("checkoutForm").addEventListener("submit", function(e) {
      e.preventDefault();
      alert("Order placed! Thank you for shopping at Velour.");
      localStorage.removeItem("cart");
      window.location.href = "index.html";
    });
  }
});
