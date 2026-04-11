// --- VIEW CONTROLLER ---
function showView(viewId) {
  document
    .querySelectorAll(".view")
    .forEach((view) => view.classList.add("hidden"));
  document.getElementById(viewId).classList.remove("hidden");

  const navTools = document.getElementById("nav-user-tools");
  if (viewId === "profileView" || viewId === "seatView") {
    navTools.classList.remove("hidden");
  } else {
    navTools.classList.add("hidden");
  }
  // Scroll to top on view change
  window.scrollTo(0, 0);
}

// --- SEAT GRID LOGIC ---
const grid = document.getElementById("seatingGrid");
const selectedInput = document.getElementById("selectedSeatsInput");
const seatCountDisplay = document.getElementById("seatCount");
let selectedSeats = [];

// Generate 48 seats for preview
for (let i = 1; i <= 48; i++) {
  const seat = document.createElement("div");
  seat.classList.add("seat");

  // Mocking some booked seats
  if ([5, 6, 14, 22, 23, 38].includes(i)) {
    seat.classList.add("booked");
  } else {
    seat.addEventListener("click", () => {
      seat.classList.toggle("selected");
      const isSelected = seat.classList.contains("selected");

      if (isSelected) {
        selectedSeats.push(i);
      } else {
        selectedSeats = selectedSeats.filter((id) => id !== i);
      }

      // Update hidden input for backend & UI text
      selectedInput.value = selectedSeats.join(",");
      seatCountDisplay.innerText = `${selectedSeats.length} Seats Selected`;
    });
  }
  grid.appendChild(seat);
}

// --- FORM HANDLING & MODAL ---
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const bookingForm = document.getElementById("bookingForm");
const successModal = document.getElementById("successModal");

// Simple transition from Auth to Profile for preview
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = loginForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Signing in...";
  submitBtn.disabled = true;

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("profileView").querySelector("h2").innerText =
        `Welcome, ${data.data.email}`;
      showView("profileView");
    } else {
      alert(data.message || "Login failed. Check your credentials.");
    }
  } catch (error) {
    console.error("Login fetch error:", error);
    alert("Unable to reach server. Try again later.");
  } finally {
    submitBtn.innerText = originalText;
    submitBtn.disabled = false;
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = registerForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "registering...";
  submitBtn.disabled = true;

  const fullname = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPass").value;

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fullname,
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful! Please sign in.");
      registerForm.reset();
      showView("loginView");
    } else {
      alert(data.error || "Registration failed. Please try again.");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Cannot connect to the server right now.");
  } finally {
    submitBtn.innerText = originalText;
    submitBtn.disabled = false;
  }
});

// Handle the "Pay" and Success Modal
bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (selectedSeats.length === 0) {
    alert("Please select at least one seat first!");
    return;
  }
  // Trigger white success modal
  successModal.classList.add("active");
});

function closeModal() {
  successModal.classList.remove("active");
  // Reset and go back
  selectedSeats = [];
  document
    .querySelectorAll(".seat.selected")
    .forEach((s) => s.classList.remove("selected"));
  selectedInput.value = "";
  seatCountDisplay.innerText = "0 Seats Selected";
  showView("profileView");
}
