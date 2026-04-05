// ---------------- SERVICES ----------------
async function loadServices() {
  const res = await fetch("/services");
  const services = await res.json();

  const container = document.getElementById("services-container");
  if (!container) return;

  container.innerHTML = "";

  services.forEach((service) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${service.title}</h3>
      <p>₹${service.price}</p>
      <p>${service.location}</p>
      <button onclick="viewService(${service.id})">View Details</button>
    `;

    container.appendChild(card);
  });
}

loadServices();

function viewService(id) {
  window.location.href = `./pages/service.html?id=${id}`;
}

function getServiceIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadServiceDetails() {
  const id = getServiceIdFromURL();
  if (!id) return;

  const res = await fetch("/services");
  const services = await res.json();

  const service = services.find((s) => s.id == id);
  if (!service) return;

  document.getElementById("title").innerText = service.title;
  document.getElementById("price").innerText = "₹" + service.price;
  document.getElementById("location").innerText = service.location;
}

if (window.location.pathname.includes("service.html")) {
  loadServiceDetails();
}

// ---------------- REGISTER ----------------
const registerForm = document.getElementById("register-form");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;

    const res = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form[1].value,
        password: form[2].value,
        role: form[3].value,
      }),
    });

    if (res.status === 409) {
      alert("User already exists");
    } else if (res.ok) {
      window.location.href = "login.html";
    } else {
      alert("Registration failed");
    }
  });
}

// ---------------- LOGIN ----------------
const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    const res = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid credentials");
    }
  });
}

// ---------------- SESSION ----------------
async function getCurrentUser() {
  const res = await fetch("/me");
  if (!res.ok) return null;
  return await res.json();
}

async function protectRoute() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
  }
}

if (window.location.pathname.includes("dashboard.html")) {
  protectRoute();
}

async function redirectIfLoggedIn() {
  const user = await getCurrentUser();
  if (user) {
    window.location.href = "dashboard.html";
  }
}

if (
  window.location.pathname.includes("login.html") ||
  window.location.pathname.includes("register.html")
) {
  redirectIfLoggedIn();
}

// ---------------- LOGOUT ----------------
async function logout() {
  await fetch("/logout");

  if (window.location.pathname.includes("/pages/")) {
    window.location.href = "../index.html";
  } else {
    window.location.href = "index.html";
  }
}

// ---------------- NAVBAR ----------------
async function updateNavbar() {
  const user = await getCurrentUser();
  const navDiv = document.getElementById("nav-links");

  if (!navDiv) return;

  const isInPages = window.location.pathname.includes("/pages/");

  if (!user) {
    navDiv.innerHTML = isInPages
      ? `<a href="login.html">Login</a>`
      : `<a href="pages/login.html">Login</a>`;
    return;
  }

  if (user.role === "provider") {
    navDiv.innerHTML = isInPages
      ? `
        <a href="dashboard.html">Dashboard</a>
        <a href="add-service.html">Add Service</a>
        <button onclick="logout()">Logout</button>
      `
      : `
        <a href="pages/dashboard.html">Dashboard</a>
        <a href="pages/add-service.html">Add Service</a>
        <button onclick="logout()">Logout</button>
      `;
  } else {
    navDiv.innerHTML = isInPages
      ? `
        <a href="dashboard.html">Dashboard</a>
        <button onclick="logout()">Logout</button>
      `
      : `
        <a href="pages/dashboard.html">Dashboard</a>
        <button onclick="logout()">Logout</button>
      `;
  }
}

updateNavbar();

// ---------------- ADD SERVICE ----------------
const serviceForm = document.getElementById("service-form");

if (serviceForm) {
  (async () => {
    const user = await getCurrentUser();

    if (!user || user.role !== "provider") {
      window.location.href = "login.html";
      return;
    }

    serviceForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const form = e.target;

      const res = await fetch("/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form[0].value,
          category: form[1].value,
          price: form[2].value,
          location: form[3].value,
          description: form[4].value,
        }),
      });

      if (res.ok) {
        alert("Service added");
        window.location.href = "dashboard.html";
      } else {
        alert("Failed to add service");
      }
    });
  })();
}

// ---------------- BOOKINGS ----------------
async function bookService() {
  const user = await getCurrentUser();

  if (!user) {
    alert("Login required");
    window.location.href = "login.html";
    return;
  }

  if (user.role === "provider") {
    alert("Providers cannot book services");
    return;
  }

  const serviceId = getServiceIdFromURL();

  const res = await fetch("/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ serviceId }),
  });

  if (res.ok) {
    alert("Booking placed");
  } else {
    alert("Failed to book");
  }
}

// ---------------- DASHBOARD ----------------
async function loadDashboard() {
  const user = await getCurrentUser();
  if (!user) return;

  const container = document.getElementById("dashboard");
  if (!container) return;

  const [servicesRes, bookingsRes] = await Promise.all([
    fetch("/services"),
    fetch("/bookings"),
  ]);

  const services = await servicesRes.json();
  const bookings = await bookingsRes.json();

  if (user.role === "provider") {
    const myServices = services.filter(s => s.providerId === user.email);

    const myBookings = bookings.filter(b =>
      myServices.some(s => s.id === b.serviceId)
    );

    container.innerHTML = myBookings.map(b => {
      const service = services.find(s => s.id === b.serviceId);
      if (!service) return "";

      return `
        <div class="card">
          <h3>${service.title}</h3>
          <p>Status: ${b.status}</p>
          <button onclick="updateBooking(${b.id}, 'accepted')">Accept</button>
          <button onclick="updateBooking(${b.id}, 'rejected')">Reject</button>
        </div>
      `;
    }).join("");
  } else {
    const myBookings = bookings.filter(b => b.userId === user.email);

    container.innerHTML = myBookings.map(b => {
      const service = services.find(s => s.id === b.serviceId);
      if (!service) return "";

      return `
        <div class="card">
          <h3>${service.title}</h3>
          <p>Status: ${b.status}</p>
        </div>
      `;
    }).join("");
  }
}

async function updateBooking(id, status) {
  await fetch("/bookings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, status }),
  });

  loadDashboard();
}

if (window.location.pathname.includes("dashboard.html")) {
  loadDashboard();
}