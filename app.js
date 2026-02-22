/* ============================
   MyFoods — app.js
============================ */

// ---- MENU DATA ----
const menuItems = [
  // North Indian
  { id: 1, name: "Butter Chicken", emoji: "🍛", price: 320, desc: "Tender chicken in rich, creamy tomato sauce", category: "north", badge: "Bestseller", isVeg: false },
  { id: 2, name: "Dal Makhani", emoji: "🥘", price: 220, desc: "Slow-cooked black lentils in buttery gravy", category: "north", badge: "Veg", isVeg: true },
  { id: 3, name: "Paneer Tikka Masala", emoji: "🧀", price: 280, desc: "Grilled paneer cubes in spicy masala sauce", category: "north", badge: "Veg", isVeg: true },
  { id: 4, name: "Biryani — Hyderabadi", emoji: "🍚", price: 360, desc: "Aromatic basmati rice with tender meat & spices", category: "north", badge: "Must Try", isVeg: false },
  { id: 5, name: "Chole Bhature", emoji: "🫓", price: 180, desc: "Spicy chickpeas with fluffy fried bread", category: "north", badge: "Veg", isVeg: true },
  { id: 6, name: "Garlic Naan", emoji: "🫓", price: 60, desc: "Soft bread baked in tandoor with garlic butter", category: "north", badge: "Veg", isVeg: true },

  // South Indian
  { id: 7, name: "Masala Dosa", emoji: "🥞", price: 150, desc: "Crispy crepe filled with spiced potato", category: "south", badge: "Veg", isVeg: true },
  { id: 8, name: "Idli Sambar", emoji: "🍱", price: 100, desc: "Steamed rice cakes with tangy lentil soup", category: "south", badge: "Veg", isVeg: true },
  { id: 9, name: "Chicken Chettinad", emoji: "🍗", price: 340, desc: "Fiery Chettinad-style chicken curry", category: "south", badge: "Spicy 🌶️", isVeg: false },
  { id: 10, name: "Medu Vada", emoji: "🍩", price: 80, desc: "Crispy lentil donuts served with chutney", category: "south", badge: "Veg", isVeg: true },

  // Street Food
  { id: 11, name: "Pani Puri", emoji: "🫧", price: 60, desc: "Crispy puris filled with tangy spiced water", category: "street", badge: "Veg", isVeg: true },
  { id: 12, name: "Vada Pav", emoji: "🍔", price: 50, desc: "Mumbai's favourite spicy potato burger", category: "street", badge: "Veg", isVeg: true },
  { id: 13, name: "Pav Bhaji", emoji: "🧈", price: 140, desc: "Buttery mixed vegetable mash with bread", category: "street", badge: "Veg", isVeg: true },
  { id: 14, name: "Chicken Shawarma Roll", emoji: "🌯", price: 160, desc: "Juicy chicken wrapped with chutney in paratha", category: "street", badge: "Hot", isVeg: false },

  // Desserts
  { id: 15, name: "Gulab Jamun", emoji: "🟤", price: 80, desc: "Soft milk-solid dumplings in rose syrup", category: "dessert", badge: "Veg", isVeg: true },
  { id: 16, name: "Mango Kulfi", emoji: "🍦", price: 90, desc: "Traditional Indian ice cream with mango", category: "dessert", badge: "Veg", isVeg: true },
  { id: 17, name: "Ras Malai", emoji: "🍮", price: 120, desc: "Soft cottage cheese discs in saffron milk", category: "dessert", badge: "Veg", isVeg: true },

  // Drinks
  { id: 18, name: "Mango Lassi", emoji: "🥭", price: 80, desc: "Chilled blended mango with yogurt", category: "drinks", badge: "Veg", isVeg: true },
  { id: 19, name: "Masala Chai", emoji: "☕", price: 40, desc: "Aromatic spiced milk tea", category: "drinks", badge: "Veg", isVeg: true },
  { id: 20, name: "Fresh Lime Soda", emoji: "🍋", price: 60, desc: "Cool lime soda — sweet or salted", category: "drinks", badge: "Veg", isVeg: true },
];

let cart = {};
let currentCategory = 'all';
let currentOrderId = null;
let currentPayMethod = 'upi';
let currentUPIApp = null;

// ---- RENDER MENU ----
function renderMenu(items) {
  const grid = document.getElementById('menu-grid');
  grid.innerHTML = '';
  items.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'menu-card';
    div.style.animationDelay = (i * 0.06) + 's';
    div.innerHTML = `
      <div class="card-img">
        <span>${item.emoji}</span>
        <div class="card-badge ${item.isVeg ? 'veg' : ''}">${item.badge}</div>
      </div>
      <div class="card-body">
        <h4>${item.name}</h4>
        <p>${item.desc}</p>
        <div class="card-footer">
          <span class="price">₹${item.price}</span>
          <button class="add-btn" onclick="addToCart(${item.id})">+ Add</button>
        </div>
      </div>`;
    grid.appendChild(div);
  });
}

function filterMenu(cat) {
  currentCategory = cat;
  document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');
  const filtered = cat === 'all' ? menuItems : menuItems.filter(i => i.category === cat);
  renderMenu(filtered);
}

// ---- CART ----
function addToCart(id) {
  const item = menuItems.find(i => i.id === id);
  if (!item) return;
  if (cart[id]) {
    cart[id].qty++;
  } else {
    cart[id] = { ...item, qty: 1 };
  }
  updateCartUI();
  showToast(`🛒 ${item.name} added!`);
  // Open cart if not open
  if (!document.getElementById('cart-sidebar').classList.contains('open')) {
    toggleCart();
  }
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  updateCartUI();
}

function updateCartUI() {
  const items = Object.values(cart);
  const count = items.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cart-count').textContent = count;

  const container = document.getElementById('cart-items');
  const footer = document.getElementById('cart-footer');

  if (items.length === 0) {
    container.innerHTML = '<p class="empty-cart">Your cart is empty 🥺</p>';
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  container.innerHTML = items.map(item => `
    <div class="cart-item">
      <span class="ci-emoji">${item.emoji}</span>
      <div class="ci-info">
        <h5>${item.name}</h5>
        <span>₹${item.price * item.qty}</span>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    </div>
  `).join('');

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + gst + 40;

  document.getElementById('subtotal').textContent = '₹' + subtotal;
  document.getElementById('gst').textContent = '₹' + gst;
  document.getElementById('total').textContent = '₹' + total;
  document.getElementById('pay-total-amt').textContent = '₹' + total;
  document.getElementById('pay-total-amt') && (lastTotal = total);
}

function toggleCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  const open = sidebar.classList.contains('open');
  sidebar.classList.toggle('open', !open);
  overlay.classList.toggle('show', !open);
}

// ---- CHECKOUT ----
let lastTotal = 0;

function showCheckout() {
  toggleCart();
  document.getElementById('checkout-modal').classList.add('show');
  goStep(1);
}

function closeCheckout() {
  document.getElementById('checkout-modal').classList.remove('show');
}

function goStep(n) {
  [1, 2, 3].forEach(i => {
    document.getElementById('step-' + i).classList.toggle('hidden', i !== n);
    const dot = document.getElementById('step-dot-' + i);
    dot.classList.remove('active', 'done');
    if (i < n) dot.classList.add('done');
    else if (i === n) dot.classList.add('active');
  });
  // Update lines
  document.querySelectorAll('.step-line').forEach((line, idx) => {
    line.classList.toggle('done', idx < n - 1);
  });

  if (n === 2) {
    // Calculate total
    const items = Object.values(cart);
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const gst = Math.round(subtotal * 0.05);
    lastTotal = subtotal + gst + 40;
    document.getElementById('pay-total-amt').textContent = '₹' + lastTotal;
  }
}

function selectPay(el, method) {
  document.querySelectorAll('.pay-option').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  currentPayMethod = method;
  const fields = ['upi', 'card', 'netbanking', 'wallet', 'cod'];
  fields.forEach(f => {
    const el = document.getElementById('fields-' + f);
    if (el) el.classList.toggle('hidden', f !== method);
  });
}

function selectUPI(el, app) {
  document.querySelectorAll('.upi-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  currentUPIApp = app;
}

function formatCard(input) {
  let v = input.value.replace(/\D/g, '');
  input.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function generateOrderId() {
  const num = Math.floor(Math.random() * 90000) + 10000;
  return 'MF-2024-' + num;
}

function placeOrder() {
  const name = document.getElementById('cust-name')?.value;
  const phone = document.getElementById('cust-phone')?.value;
  if (!name || !phone) { showToast('⚠️ Please fill address details first'); goStep(1); return; }

  // Simulate payment processing
  showToast('💳 Processing payment...');
  setTimeout(() => {
    currentOrderId = generateOrderId();
    document.getElementById('order-id-display').textContent = currentOrderId;
    goStep(3);
    showToast('🎉 Order placed successfully!');
    // Clear cart
    cart = {};
    updateCartUI();
  }, 1800);
}

function goToTrack() {
  closeCheckout();
  document.getElementById('track-input').value = currentOrderId;
  document.getElementById('track').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => trackOrder(), 600);
}

// ---- ORDER TRACKING ----
const mockOrders = {
  'MF-2024-001': { items: 'Butter Chicken, Naan ×2', total: '₹480', eta: '12 mins', status: 3, agent: 'Ramesh Kumar', phone: '+919876543210' },
  'MF-2024-002': { items: 'Dal Makhani, Rice', total: '₹310', eta: '5 mins', status: 4, agent: 'Suresh Yadav', phone: '+919876543211' },
  'MF-2024-003': { items: 'Masala Dosa ×3', total: '₹510', eta: '20 mins', status: 2, agent: 'Vijay Kumar', phone: '+919876543212' },
};

const statusLabels = ['', 'Order Confirmed', 'Preparing Food', 'Out for Delivery', 'Delivered'];
const statusTimes = ['', '2 mins ago', '5 mins ago', '18 mins ago', 'Just now'];

function trackOrder() {
  let id = document.getElementById('track-input').value.trim().toUpperCase();
  if (!id) { showToast('⚠️ Enter an Order ID'); return; }

  // If no order found in mock, use currentOrderId data if matches
  let order = mockOrders[id];
  if (!order && currentOrderId === id) {
    order = {
      items: Object.values(cart).map(i => i.name).join(', ') || 'Your items',
      total: '₹' + lastTotal,
      eta: '25 mins',
      status: 1,
      agent: 'Arjun Sharma',
      phone: '+919876543213'
    };
  }

  if (!order) {
    showToast('❌ Order not found. Try: MF-2024-001');
    return;
  }

  document.getElementById('track-result').classList.remove('hidden');
  document.getElementById('tr-id').textContent = id;
  document.getElementById('tr-items').textContent = order.items;
  document.getElementById('tr-total').textContent = order.total;
  document.getElementById('tr-eta').textContent = order.status === 4 ? 'Delivered ✅' : order.eta;
  document.getElementById('agent-name').textContent = order.agent;

  // Animate progress steps
  animateProgress(order.status);
}

function animateProgress(status) {
  const steps = [1, 2, 3, 4];
  const times = ['12:30 PM', '12:35 PM', '12:50 PM', '1:05 PM'];

  steps.forEach((s, i) => {
    const stepEl = document.getElementById('prog-' + s);
    const lineEl = document.getElementById('pl' + s);
    const timeEl = document.getElementById('pt' + s);
    stepEl.classList.remove('done', 'active');
    if (lineEl) lineEl.classList.remove('done');

    setTimeout(() => {
      if (s < status) {
        stepEl.classList.add('done');
        if (lineEl) lineEl.classList.add('done');
        timeEl.textContent = times[i];
      } else if (s === status) {
        stepEl.classList.add('active');
        timeEl.textContent = 'Now';
      }
    }, i * 300);
  });
}

// ---- CONTACT FORM ----
function submitContact(e) {
  e.preventDefault();
  showToast('✅ Message sent! We\'ll respond within 24 hours.');
  e.target.reset();
}

// ---- TOAST ----
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ---- NAVBAR SCROLL ----
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.boxShadow = window.scrollY > 30 ? '0 4px 30px rgba(255,107,0,0.15)' : '';
});

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  renderMenu(menuItems);
  updateCartUI();

  // Close modals on escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeCheckout();
      if (document.getElementById('cart-sidebar').classList.contains('open')) toggleCart();
    }
  });

  // Scroll animations for menu cards
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.style.opacity = '1';
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.menu-card').forEach(card => observer.observe(card));
});