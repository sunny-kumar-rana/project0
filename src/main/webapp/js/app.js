const services = [
  { title: "Electrician", price: 500, location: "Hyderabad" },
  { title: "Plumber", price: 300, location: "Chennai" },
  { title: "Math Tutor", price: 700, location: "Bangalore" },
  { title: "AC Repair", price: 600, location: "Delhi" }
];

const container = document.getElementById("services-container");

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

function viewService(id) {
  window.location.href = `pages/service.html?id=${id}`;
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
}
if (window.location.pathname.includes("service.html")) {
  loadServiceDetails();
}