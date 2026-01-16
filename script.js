let cart = [];

let scrollIndex = 0;
const cardWidth = 251 + 24;
const maxVisible = 3;

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("popular_items");
  const totalCards = container?.querySelectorAll(".popular_card").length || 0;

  const leftBtn = document.getElementById("scrollLeftBtn");
  const rightBtn = document.getElementById("scrollRightBtn");

  if (leftBtn) {
    leftBtn.addEventListener("click", () => {
      if (scrollIndex > 0) {
        scrollIndex--;
        updateScroll(container);
      }
    });
  }

  if (rightBtn) {
    rightBtn.addEventListener("click", () => {
      if (scrollIndex < totalCards - maxVisible) {
        scrollIndex++;
        updateScroll(container);
      }
    });
  }


  window.addEventListener("resize", () => updateScroll(container));

  const cards = document.querySelectorAll(".special_card");

  cards.forEach(card => {
    card.addEventListener("click", (e) => {
      if (
        e.target.closest(".card_controls") ||
        e.target.classList.contains("qty_btn") ||
        e.target.classList.contains("add_to_cart_btn")
      ) return;

      cards.forEach(c => c.classList.remove("show_controls"));
      card.classList.add("show_controls");
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".special_card")) {
      cards.forEach(card => card.classList.remove("show_controls"));
    }
  });

  // ---------------------
  // Search Functionality
  // ---------------------
  const searchBar = document.getElementById("searchBar");
  const allCards = document.querySelectorAll(".special_card, .popular_card");

  if (searchBar) {
    searchBar.addEventListener("input", () => {
      const query = searchBar.value.toLowerCase().trim();
      allCards.forEach(card => {
        const cardText = card.innerText.toLowerCase();
        card.style.display = cardText.includes(query) ? "" : "none";
      });
    });
  }

  // ---------------------
  // Quantity + Price Update for Special Items
  // ---------------------
  document.querySelectorAll(".special_card").forEach(card => {
    const qtyDisplay = card.querySelector(".qty_number");
    const minusBtn = card.querySelectorAll(".qty_btn")[0];
    const plusBtn = card.querySelectorAll(".qty_btn")[1];
    const priceElement = card.querySelector(".price");

    if (qtyDisplay && priceElement && minusBtn && plusBtn) {
      const basePrice = parseFloat(priceElement.textContent.replace("₹", "")) || 0;

      plusBtn.addEventListener("click", () => {
        let qty = parseInt(qtyDisplay.textContent) || 1;
        qty++;
        qtyDisplay.textContent = qty;
        priceElement.textContent = `₹${(basePrice * qty).toFixed(2)}`;
      });

      minusBtn.addEventListener("click", () => {
        let qty = parseInt(qtyDisplay.textContent) || 1;
        if (qty > 1) {
          qty--;
          qtyDisplay.textContent = qty;
          priceElement.textContent = `₹${(basePrice * qty).toFixed(2)}`;
        }
      });
    }
  });

  // ---------------------
  // Quantity + Price Update for Popular Items
  // ---------------------
  document.querySelectorAll(".popular_card").forEach(card => {
    const qtyDisplay = card.querySelector(".qty_number");
    const minusBtn = card.querySelectorAll(".qty_btn")[0];
    const plusBtn = card.querySelectorAll(".qty_btn")[1];
    const priceElement = card.querySelector(".price");

    if (qtyDisplay && priceElement && minusBtn && plusBtn) {
      const basePrice = parseFloat(priceElement.textContent.replace("₹", "")) || 0;

      plusBtn.addEventListener("click", () => {
        let qty = parseInt(qtyDisplay.textContent) || 1;
        qty++;
        qtyDisplay.textContent = qty;
        priceElement.textContent = `₹${(basePrice * qty).toFixed(2)}`;
      });

      minusBtn.addEventListener("click", () => {
        let qty = parseInt(qtyDisplay.textContent) || 1;
        if (qty > 1) {
          qty--;
          qtyDisplay.textContent = qty;
          priceElement.textContent = `₹${(basePrice * qty).toFixed(2)}`;
        }
      });
    }
  });

});

function updateScroll(container) {
  const offset = scrollIndex * cardWidth;
  container.style.transition = "transform 0.3s ease";
  container.style.transform = `translateX(-${offset}px)`;
}

(function () {
  function showCartPopup(quantity) {
    const popup = document.getElementById("popup");
    const msg = document.getElementById("popupText");
    if (!popup || !msg) {
      console.warn("Popup elements #popup / #popupText not found.");
      return;
    }

    msg.textContent = `${quantity} item${quantity > 1 ? "s" : ""} added to cart`;
    popup.style.display = "block";
  }

  window.closePopup = function () {
    const popup = document.getElementById("popup");
    if (popup) {
      popup.style.display = "none";
    }
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".add_to_cart_btn");
    if (!btn) return;

    const card = btn.closest(".special_card, .popular_card");
    let qty = 1;
    const qtyEl = card ? card.querySelector(".qty_number") : null;
    if (qtyEl) {
      const n = parseInt(qtyEl.textContent, 10);
      if (!isNaN(n) && n > 0) qty = n;
    }

    showCartPopup(qty);
  });
})();
document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.querySelector(".contact_form form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const commentInput = document.getElementById("comment");
    const popup = document.getElementById("popup");
    const popupText = document.getElementById("popupText");

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault(); 

  
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const comment = commentInput.value.trim();

    
        if (!name || !email || !comment) {
            popupText.textContent = "Fill the required fields";
            popup.style.display = "block";
        } 
        else if (!email.endsWith("@gmail.com")) {
            popupText.textContent = "Enter valid email";
            popup.style.display = "block";
        } 
        else {
            popupText.textContent = "Your feedback submitted successfully";
            popup.style.display = "block";
            contactForm.reset(); 
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
  const cartBtn      = document.getElementById('cartBtn');
  const cartOverlay  = document.getElementById('cartOverlay');
  const cartPanel    = document.getElementById('cartPanel');
  const cartClose    = document.getElementById('cartClose');
  const cartItemsEl  = document.getElementById('cartItems');
  const cartTotalEl  = document.getElementById('cartTotal');
  const cartCountEl  = document.getElementById('cartCount');
  const cartEmptyEl  = document.getElementById('cartEmpty');
  const checkoutBtn  = document.getElementById('checkoutBtn');

  

  const rupee = n => '₹' + n.toFixed(2);

  function updateCartCount(){
    const count = cart.reduce((s,i)=>s + i.qty, 0);
    if (cartCountEl) cartCountEl.textContent = count;
  }

  function renderCart(){
    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = '';

    if (cart.length === 0){
      cartEmptyEl.style.display = 'block';
      checkoutBtn.disabled = true;
      cartTotalEl.textContent = rupee(0);
      updateCartCount();
      return;
    }

    cartEmptyEl.style.display = 'none';
    checkoutBtn.disabled = false;

    let total = 0;
    cart.forEach((item, idx) => {
      total += item.unitPrice * item.qty;

      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="ci-meta">
          <h4>${item.name}</h4>
          <div class="ci-sub">${rupee(item.unitPrice)} × ${item.qty}</div>
        </div>
        <div class="ci-actions">
          <button class="ci-minus" data-idx="${idx}">−</button>
          <span class="ci-qty">${item.qty}</span>
          <button class="ci-plus" data-idx="${idx}">+</button>
          <button class="ci-remove" data-idx="${idx}">&times;</button>
        </div>
      `;
      cartItemsEl.appendChild(row);
    });

    cartTotalEl.textContent = rupee(total);
    updateCartCount();
  }

  function openCart(){
    if (!cartPanel) return;
    cartOverlay.hidden = false;
    cartPanel.classList.add('open');
    cartPanel.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeCart(){
    if (!cartPanel) return;
    cartOverlay.hidden = true;
    cartPanel.classList.remove('open');
    cartPanel.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  cartBtn?.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  cartPanel?.addEventListener('click', (e)=>{
    const minus  = e.target.closest('.ci-minus');
    const plus   = e.target.closest('.ci-plus');
    const remove = e.target.closest('.ci-remove');

    if (minus){
      const i = +minus.dataset.idx;
      if (cart[i].qty > 1) cart[i].qty--;
      else cart.splice(i,1);
      renderCart();
    }
    if (plus){
      const i = +plus.dataset.idx;
      cart[i].qty++;
      renderCart();
    }
    if (remove){
      const i = +remove.dataset.idx;
      cart.splice(i,1);
      renderCart();
    }
  });

  function addToCartFromButton(btn){
    const card = btn.closest('.special_card, .popular_card');
    if (!card) return;

    const name = (card.querySelector('h4')?.textContent || 'Item').trim();
    const img  = card.querySelector('.card_img img')?.getAttribute('src') || '';

    const qty = parseInt(card.querySelector('.qty_number')?.textContent || '1', 10) || 1;

    const priceText  = (card.querySelector('.price')?.textContent || '').replace(/[^\d.]/g, '');
    const totalPrice = parseFloat(priceText) || 0;
    const unitPrice  = qty > 0 ? totalPrice / qty : totalPrice;

    const existing = cart.find(i => i.name === name && Math.abs(i.unitPrice - unitPrice) < 0.01);
    if (existing) existing.qty += qty;
    else cart.push({ name, img, unitPrice, qty });

    renderCart();
  }

  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.add_to_cart_btn');
    if (!btn) return;

    const qtyText = btn.closest('.special_card, .popular_card')?.querySelector('.qty_number')?.textContent || '1';
    const qty     = parseInt(qtyText, 10) || 1;
    if (typeof showCartPopup === 'function') {
      showCartPopup(qty);
    }

    addToCartFromButton(btn);
  });

  renderCart();
});







document.addEventListener("DOMContentLoaded", () => {
  const orderPanel = document.getElementById("orderPanel");
  const orderClose = document.getElementById("orderClose");
  const orderForm = document.getElementById("orderForm");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const popup = document.getElementById("popup");
  const popupText = document.getElementById("popupText");

  // Open order panel
  checkoutBtn.addEventListener("click", () => {
    orderPanel.hidden = false;
    orderPanel.classList.add("open");
    document.body.style.overflow = "hidden";
  });

  // Close order panel
  orderClose.addEventListener("click", () => {
    orderPanel.hidden = true;
    orderPanel.classList.remove("open");
    document.body.style.overflow = "";
  });

  // Submit order
  orderForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  console.log("Submit clicked");

  try {
    const name = document.getElementById("orderName").value.trim();
    const mobile = document.getElementById("orderNum").value.trim();
    const address = document.getElementById("orderAddress").value.trim();

    console.log(name, mobile, address);

    if (!name || !mobile || !address) {
      alert("Fill all fields");
      return;
    }

    console.log("Cart variable:", cart);

    if (!Array.isArray(cart) || cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const totalText = document.getElementById("cartTotal").textContent;
    console.log("Total text:", totalText);

    const total = Number(totalText.replace("₹", ""));
    console.log("Total number:", total);

    const orderData = {
      name,
      mobile,
      address,
      items: cart,
      total
    };

    console.log("Order Data:", orderData);

    const API = "https://restaurant-order-app-lijr.onrender.com";

const res = await fetch(`${API}/place-order`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(orderData)
});


    console.log("Fetch response:", res);

    const data = await res.json();
    console.log("Server response:", data);

    alert("Order Placed✅");

    orderForm.reset();
    cart.length = 0;
    renderCart();

  } catch (err) {
    console.error("ERROR inside submit:", err);
    alert("Thank u for placing order");
  }
});

});










document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu_btn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-menu-links a');

  menuBtn?.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    mobileMenuOverlay.classList.add('show');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    mobileMenuOverlay.classList.remove('show');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  mobileMenuClose?.addEventListener('click', closeMobileMenu);
  mobileMenuOverlay?.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      if(targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
      closeMobileMenu();
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const userBtn      = document.getElementById('user_btn');
  const loginPanel   = document.getElementById('loginPanel');
  const loginClose   = document.getElementById('loginClose');
  const loginForm    = document.getElementById('loginForm');
  const logoutBtn    = document.getElementById('logoutBtn');
  const firstNameInp = document.getElementById('firstName');
  const lastNameInp  = document.getElementById('lastName');
  const emailInp     = document.getElementById('loginEmail');
  const overlay      = document.getElementById('cartOverlay');
  const brandLink    = document.querySelector('.nav_logo a');

  let isLoggedIn = false;
  const savedFirst = localStorage.getItem('userFirstName');
  if (savedFirst && brandLink) {
    brandLink.innerHTML = `Hello, <span>${escapeHtml(savedFirst)}</span>`;
    isLoggedIn = true;
    logoutBtn.style.display = "block";
  }

  function openLogin(){
    document.getElementById('cartPanel')?.classList.remove('open');
    document.getElementById('orderPanel')?.classList.remove('open');
    overlay.hidden = false;
    loginPanel.classList.add('open');
    loginPanel.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  function closeLogin(){
    loginPanel.classList.remove('open');
    loginPanel.setAttribute('aria-hidden','true');
    const cartOpen  = document.getElementById('cartPanel')?.classList.contains('open');
    const orderOpen = document.getElementById('orderPanel')?.classList.contains('open');
    if (!cartOpen && !orderOpen) overlay.hidden = true;
    document.body.style.overflow = '';
  }

  userBtn?.addEventListener('click', openLogin);
  loginClose?.addEventListener('click', closeLogin);

  overlay?.addEventListener('click', () => {
    if (loginPanel.classList.contains('open')) closeLogin();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginPanel.classList.contains('open')) {
      closeLogin();
    }
  });

  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const first = (firstNameInp.value || '').trim();
    const last  = (lastNameInp.value  || '').trim();
    const email = (emailInp.value     || '').trim();

    if (!first || !last || !email) {
      if (typeof showCartPopup === 'function') {
        showCartPopup(0);
        document.getElementById('popupText').textContent = 'Please fill First name, Last name and Email.';
      }
      return;
    }

    brandLink.innerHTML = `Hello, <span>${escapeHtml(first)}</span>`;
    localStorage.setItem('userFirstName', first);
    isLoggedIn = true;
    logoutBtn.style.display = "block";

    if (typeof showCartPopup === 'function') {
      showCartPopup(0);
      document.getElementById('popupText').textContent = 'Logged in successfully';
    }

    loginForm.reset();
    closeLogin();
  });

  logoutBtn?.addEventListener('click', () => {
    if (!isLoggedIn) {
      if (typeof showCartPopup === 'function') {
        showCartPopup(0);
        document.getElementById('popupText').textContent = 'You must log in first.';
      }
      return;
    }

    brandLink.innerHTML = `Phani <span>Ram</span>`;
    localStorage.removeItem('userFirstName');
    isLoggedIn = false;
    logoutBtn.style.display = "none";

    if (typeof showCartPopup === 'function') {
      showCartPopup(0);
      document.getElementById('popupText').textContent = 'Logged out successfully';
    }
  });

  function escapeHtml(s){
    return s.replace(/&/g,'&amp;')
            .replace(/</g,'&lt;')
            .replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;')
            .replace(/'/g,'&#039;');
  }
});