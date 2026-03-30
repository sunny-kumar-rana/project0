const services = [
  { id: 1, title: "Electrician", price: 500, location: "Hyderabad" },
  { id: 2, title: "Plumber", price: 300, location: "Chennai" },
  { id: 3, title: "Math Tutor", price: 700, location: "Bangalore" },
  { id: 4, title: "AC Repair", price: 600, location: "Delhi" }
];

const container = document.getElementById("services-container");

if (container) {
  services.forEach(service => {
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

  const service = services.find(s => s.id == id);

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


function getUsers(){
return JSON.parse(localStorage.getItem("users")) || []
}

function setUsers(users){
localStorage.setItem("users", JSON.stringify(users))
}

const registorForm = document.getElementById("register-form");
if(registorForm){
  
  registorForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const form = e.target;    
    const user = {name : `${form[0].value}`,
                  email : `${form[1].value}`,
                  password : `${form[2].value}`,
                  role : `${form[3].value}`};
    
    const users = getUsers();
    users.push(user);
    setUsers(users);

    window.location.href = "login.html";
  });
}

const loginForm = document.getElementById("login-form");
if(loginForm){
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    
    const user = {"email" : `${e.target[0].value}`,
                "password" : `${e.target[1].value}`};

    const users = getUsers();
    const foundUser = users.find(u => u.email === user.email && u.password === user.password
    );

    if(foundUser){
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid credentials");
    }
  });
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function protectRoute() {
  const user = getCurrentUser();

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

if (window.location.pathname.includes("login.html") || 
    window.location.pathname.includes("register.html")) {
  redirectIfLoggedIn();
}

function logout() {
  localStorage.removeItem("currentUser");
  if(window.location.pathname.includes("index.html")){
    window.location.href = "index.html";
  }
  else{
    window.location.href = "../index.html";
  }
}

function updateNavbar() {
  const user = getCurrentUser();
  const navDiv = document.querySelector("nav div");

  if (!navDiv) return;

  if (user) {
    navDiv.innerHTML = window.location.pathname.includes("index.html") ? `
      <a href="pages/service.html">services</a>
      <a href="pages/dashboard.html">dashboard</a>
      <button onclick="logout()">Logout</button>
    ` : `
      <a href="service.html">services</a>
      <button onclick="logout()">Logout</button>
    `;
  } else {
    navDiv.innerHTML = `
      <a href="pages/login.html">Login</a>
      <a href="pages/register.html">Register</a>
    `;
  }
}

updateNavbar();