const eventList = document.getElementById("eventList");
const searchBtn = document.getElementById("searchBtn");
const darkToggle = document.getElementById("darkToggle");
const loader = document.getElementById("loader");

const API_KEY = "IuXJ5Q1WKTnnaaZbkG6POb5wZAPZ61RN"; // Replace with your Ticketmaster key

// Fetch events from Ticketmaster API
async function fetchEvents(city = "India", date = "", category = "") {
  showLoader();
  try {
    const dateParam = date ? `&startDateTime=${date}T00:00:00Z` : "";
    const segmentParam = category ? `&classificationName=${category}` : "";

    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&city=${city}${dateParam}${segmentParam}&size=12`
    );
    const data = await response.json();

    if (!data._embedded || !data._embedded.events) {
      eventList.innerHTML = `<p class="text-gray-500 col-span-full text-center">No events found.</p>`;
      hideLoader();
      return;
    }

    const events = data._embedded.events;
    displayEvents(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    eventList.innerHTML = `<p class="text-red-500 text-center col-span-full">Failed to load events.</p>`;
  }
  hideLoader();
}

// Display event cards
function displayEvents(events) {
  eventList.innerHTML = "";
  events.forEach(ev => {
    const image = ev.images ? ev.images[0].url : "https://via.placeholder.com/400x250";
    const name = ev.name || "Unnamed Event";
    const city = ev._embedded?.venues?.[0]?.city?.name || "Unknown";
    const date = ev.dates?.start?.localDate || "TBA";
    const url = ev.url || "#";
    const segment = ev.classifications?.[0]?.segment?.name || "General";

    eventList.innerHTML += `
      <div class="bg-white rounded-xl overflow-hidden shadow-md event-card">
        <img src="${image}" alt="${name}" class="w-full h-48 object-cover">
        <div class="p-4">
          <h2 class="text-xl font-semibold text-blue-600">${name}</h2>
          <p class="text-gray-600 mt-1">📍 ${city}</p>
          <p class="text-gray-500">📅 ${date}</p>
          <span class="inline-block mt-2 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">${segment}</span>
          <a href="${url}" target="_blank" class="block mt-3 bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700">View Details</a>
        </div>
      </div>
    `;
  });
}

// Show/hide loader
function showLoader() { loader.classList.remove("hidden"); }
function hideLoader() { loader.classList.add("hidden"); }

// Search button
searchBtn.addEventListener("click", () => {
  const city = document.getElementById("searchInput").value || "India";
  const date = document.getElementById("dateInput").value;
  const category = document.getElementById("categorySelect").value;
  fetchEvents(city, date, category);
});

// Dark mode
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkToggle.textContent = document.body.classList.contains("dark-mode")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
});

// Load default events
fetchEvents();
