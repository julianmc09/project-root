
const routes = {
  "/login": renderLogin,
  "/register": renderRegister,
  "/dashboard": renderDashboard
};

// Function to condition navigation depending on whether you have logged in, registered or not
function router() {
  const path = location.hash.slice(1) || "/dashboard";
  const user = getUser();

  if (!user && path !== "/login" && path !== "/register") {
    renderNotFound();
  } else if (user && (path === "/login" || path === "/register")) {
    renderDashboard();
  } else {
    (routes[path] || renderNotFound)();
  }

  document.getElementById("logout-link").style.display = user ? "inline" : "none";
}


// Option to log in
function renderLogin() {
  document.getElementById("app").innerHTML = `
    <div class="auth-container login-view">
      <h2>Login</h2>
      <form id="login-form">
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Log in</button>
      </form>
    </div>`;


  // Event listener for the login form submission
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const res = await fetch(`http://localhost:3000/users?email=${email}&password=${password}`);
    const users = await res.json();

    // If the user exists, save it to localStorage and redirect to the dashboard
    if (users.length) {
      localStorage.setItem("user", JSON.stringify(users[0]));
      location.hash = "/dashboard";
    } else {
      alert("Incorrect email or password");
    }
  });
}

// Function to register
function renderRegister() {
document.getElementById("app").innerHTML = `
    <div class="auth-container register-view">
        <h2>Register</h2>
        <form id="register-form">
            <input name="fullName" placeholder="Full Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <input type="password" name="confirm" placeholder="Confirm Password" required />
            <select name="role">
                <option value="visitor">Visitor</option>
                <option value="admin">Admin</option>
            </select>
            <button type="submit">Register</button>
        </form>
    </div>`;

  document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (e.target.password.value !== e.target.confirm.value) {
      return alert("Passwords do not match");
    }

    const user = {
      fullName: e.target.fullName.value,
      email: e.target.email.value,
      password: e.target.password.value,
      role: e.target.role.value
    };

    await fetch(`http://localhost:3000/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    alert("User registered successfully");
    location.hash = "/login";
  });
}


// Function to display available events
function renderDashboard() {
  const user = getUser();
  document.getElementById("app").innerHTML = `
    <div class="dashboard">
      <h2>Available Events</h2>
      <div id="events"></div>
      ${user.role === "admin" ? `
        <h3>Create Event</h3>
        <form id="create-event">
          <input name="title" placeholder="Title" required />
          <input name="date" placeholder="Date" required />
          <input name="capacity" type="number" placeholder="Capacity" required />
          <button type="submit">Create</button>
        </form>` : ""}
    </div>`;

  if (user.role === "admin") {
    document.getElementById("create-event").addEventListener("submit", async (e) => {
      e.preventDefault();
      const newEvent = {
        title: e.target.title.value,
        date: e.target.date.value,
        capacity: parseInt(e.target.capacity.value)
      };

      await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent)
      });

      renderDashboard();
    });
  }

  loadEvents();
}

async function loadEvents() {
  const user = getUser();
  const res = await fetch("http://localhost:3000/events");
  const events = await res.json();
  const container = document.getElementById("events");

  if (!events.length) return container.innerHTML = "<p>No events available.</p>";

  container.innerHTML = events.map(ev => `
    <div class="event-card">
      <strong>${ev.title}</strong><br>
      <small>${ev.date}</small><br>
      <span>Capacity: ${ev.capacity}</span><br>
      ${user.role === "admin" ? `
        <button onclick="deleteEvent('${ev.id}')">Delete</button>
      ` : ""}
    </div>`).join("");
    
}

// Function to delete events
async function deleteEvent(id) {
  if (confirm("Are you sure you want to delete this event?")) {
    await fetch(`http://localhost:3000/events/${id}`, { method: "DELETE" });
    renderDashboard();

  }
}

// Function to display a message when you are not logged in or registered.
function renderNotFound() {
  document.getElementById("app").innerHTML = `
    <div class="not-found">
      <h2>404</h2>
      <p>Page not found</p>
    </div>`;
}

function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

// Event listener for the logout link
document.getElementById("logout-link").addEventListener("click", () => {
  localStorage.removeItem("user");
  location.hash = "/login";
});

window.addEventListener("hashchange", router);
document.addEventListener("DOMContentLoaded", router);