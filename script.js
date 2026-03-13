const CART_KEY = "maybeoshiCart";

const products = {
  "apple-bite": { id: "apple-bite", name: "Apple Bite", price: 249 },
  "button-berry": { id: "button-berry", name: "Button Berry", price: 249 },
  "cacao-blend": { id: "cacao-blend", name: "Cacao Blend", price: 249 },
};

function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + 1;
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const cartContainer = document.getElementById("cartItems");
  const totalElement = document.getElementById("cartTotal");
  if (!cartContainer || !totalElement) return;

  const cart = getCart();
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);

  if (entries.length === 0) {
    cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty. Add your favorite shade.</p>';
    totalElement.textContent = "₹0";
    return;
  }

  let total = 0;
  cartContainer.innerHTML = "";

  entries.forEach(([id, qty]) => {
    const product = products[id];
    if (!product) return;
    const subtotal = product.price * qty;
    total += subtotal;

    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `<span>${product.name} × ${qty}</span><strong>₹${subtotal}</strong>`;
    cartContainer.appendChild(row);
  });

  totalElement.textContent = `₹${total}`;
}

function setupProductPage() {
  const buttons = document.querySelectorAll(".add-btn");
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const { id } = button.dataset;
      if (id) addToCart(id);
    });
  });

  renderCart();
}

function setupCheckoutPage() {
  const form = document.getElementById("checkoutForm");
  const message = document.getElementById("formMessage");
  if (!form || !message) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const requiredFields = form.querySelectorAll("input[required]");
    const hasEmpty = Array.from(requiredFields).some((field) => !field.value.trim());

    if (hasEmpty) {
      message.textContent = "Please fill all required fields.";
      message.className = "form-message error";
      return;
    }

    const formData = Object.fromEntries(new FormData(form).entries());
    localStorage.setItem("maybeoshiAddress", JSON.stringify(formData));

    message.textContent = "Your order details have been saved.";
    message.className = "form-message success";
    form.reset();
  });
}

setupProductPage();
setupCheckoutPage();
