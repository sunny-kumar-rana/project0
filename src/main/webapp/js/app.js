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

const container = document.getElementById("services-container");

if (container) {
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

function viewService(id) {
  window.location.href = `./pages/service.html?id=${id}`;
}

function getServiceIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function loadServiceDetails() {
  const id = getServiceIdFromURL();

  if (!id) return;

  const service = services.find((s) => s.id == id);

  if (!service) return;

  document.getElementById("title").innerText = service.title;
  document.getElementById("price").innerText = "₹" + service.price;
  document.getElementById("location").innerText = service.location;

  console.log("LOADING SERVICE PAGE");
  console.log("ID:", id);
}

if (window.location.pathname.includes("service.html")) {
  loadServiceDetails();
}

// ---------------- USERS ----------------
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function setUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

const registorForm = document.getElementById("register-form");

if (registorForm) {
  registorForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const form = e.target;

    const user = {
      name: form[0].value,
      email: form[1].value,
      password: form[2].value,
      role: form[3].value,
    };

    const users = getUsers();
    users.push(user);
    setUsers(users);

    window.location.href = "login.html";
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
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
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

function redirectIfLoggedIn() {
  const user = getCurrentUser();

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
  const user = getCurrentUser();

  if (!user || user.role !== "provider") {
    window.location.href = "login.html";
  }

  serviceForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;

    const newService = {
      id: Date.now(),
      providerId: user.email,
      title: form[0].value,
      category: form[1].value,
      price: form[2].value,
      location: form[3].value,
      description: form[4].value,
    };

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

    alert("Service added");

    window.location.href = "dashboard.html";
  });
}

if (container && services.length === 0) {
  container.innerHTML = "<p>No services available</p>";
}

// ---------------- DASHBOARD ----------------
function loadDashboard() {
  const user = getCurrentUser();
  const services = getServices();
  const bookings = getBookings();

  const container = document.getElementById("dashboard");

  if (!container) return;

  if (user.role === "provider") {
    const myServices = services.filter((s) => s.providerId === user.email);

    const myBookings = bookings.filter((b) =>
      myServices.some((s) => s.id === b.serviceId),
    );

    container.innerHTML = myBookings
      .map((b) => {
        const service = services.find((s) => s.id === b.serviceId);
        if (!service) return "";

        return `
        <div class="card">
          <h3>${service.title}</h3>
          <p>Status: ${b.status}</p>

          <button onclick="updateBooking(${b.id}, 'accepted')">Accept</button>
          <button onclick="updateBooking(${b.id}, 'rejected')">Reject</button>
        </div>
      `;
      })
      .join("");
  } else {
    const myBookings = bookings.filter((b) => b.userId === user.email);

    container.innerHTML = myBookings
      .map((b) => {
        const service = services.find((s) => s.id === b.serviceId);
        if (!service) return "";

        return `
        <div class="card">
          <h3>${service.title}</h3>
          <p>Status: ${b.status}</p>
        </div>
      `;
      })
      .join("");
  }
}

if (window.location.pathname.includes("dashboard.html")) {
  loadDashboard();
}

// ---------------- BOOKINGS ----------------
function getBookings() {
  return JSON.parse(localStorage.getItem("bookings")) || [];
}

function saveBookings(bookings) {
  localStorage.setItem("bookings", JSON.stringify(bookings));
}

function bookService() {
  const user = getCurrentUser();

  if (!user) {
    alert("Login required");
    window.location.href = "login.html";
    return;
  }

  if (user.role === "provider") {
    alert("Providers cannot book services");
    return;
  }

  const serviceId = getServiceIdFromURL(); // FIXED ORDER

  const bookings = getBookings();

  const alreadyBooked = bookings.some(
    (b) => b.userId === user.email && b.serviceId == serviceId,
  );

  if (alreadyBooked) {
    alert("Already booked");
    return;
  }

  const newBooking = {
    id: Date.now(),
    userId: user.email,
    serviceId: Number(serviceId),
    status: "pending",
  };

  bookings.push(newBooking);
  saveBookings(bookings);

  alert("Booking placed");
}

// ---------------- UPDATE BOOKING ----------------
function updateBooking(id, status) {
  const bookings = getBookings();

  const booking = bookings.find((b) => b.id === id);

  if (!booking) return;

  booking.status = status;

  saveBookings(bookings);

  loadDashboard();
}
