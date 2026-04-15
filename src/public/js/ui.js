let currentUser = JSON.parse(localStorage.getItem("chai_cinema_user")) || null;
let seats = [];
let selected = new Set();
let toastT;

const PRICE_STD = 220,
  PRICE_PREM = 380;
const PREMIUM = ["A", "B"],
  ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"],
  COLS = 10;

// CORE UI FUNCTIONS

function renderSkeleton() {
  const m = document.getElementById("seatMap");
  if (!m) return;
  let h = "";
  ROWS.forEach((r) => {
    if (r === "A")
      h += `<div class="sec-h p">&#9733; Premium &mdash; &#8377;${PRICE_PREM}</div>`;
    if (r === "C")
      h += `<div class="sec-h">Standard &mdash; &#8377;${PRICE_STD}</div>`;
    h += `<div class="seat-row"><div class="rlbl">${r}</div>`;
    for (let c = 0; c < COLS; c++) {
      h +=
        c === 5
          ? `<div class="seat gap"></div><div class="skel"></div>`
          : `<div class="skel"></div>`;
    }
    h += "</div>";
  });
  m.innerHTML = h;
}

function renderGrid() {
  const m = document.getElementById("seatMap");
  if (!m) return;
  const byRow = {};
  seats.forEach((s) => {
    if (!byRow[s.row]) byRow[s.row] = [];
    byRow[s.row].push(s);
  });

  let h = "";
  ROWS.forEach((row) => {
    if (row === "A")
      h += `<div class="sec-h p">&#9733; Premium &mdash; &#8377;${PRICE_PREM}</div>`;
    if (row === "C")
      h += `<div class="sec-h">Standard &mdash; &#8377;${PRICE_STD}</div>`;

    const rs = (byRow[row] || []).sort((a, b) => a.col - b.col);
    h += `<div class="seat-row"><div class="rlbl">${row}</div>`;

    rs.forEach((s, i) => {
      if (i === 5) h += `<div class="seat gap" aria-hidden="true"></div>`;
      const bk = !!s.bookedBy,
        sel = selected.has(s.id),
        pr = PREMIUM.includes(s.row);
      let cls = "seat";
      if (bk) cls += " booked";
      else if (sel) cls += " selected";
      else if (pr) cls += " premium";
      h += `<div class="${cls}" data-id="${s.id}" title="${bk ? "Booked" : "Seat " + s.id}" onclick="window.seatClick('${s.id}')"></div>`;
    });
    h += "</div>";
  });
  m.innerHTML = h;
}

window.seatClick = function (id) {
  const s = seats.find((x) => x.id === id);
  if (!s || s.bookedBy) return;
  if (!currentUser) {
    window.openModal("promptOv");
    return;
  }

  selected.has(id) ? selected.delete(id) : selected.add(id);
  updateBar();
  renderGrid();
};

function updateBar() {
  const bar = document.getElementById("bbar"),
    n = selected.size;
  if (!bar) return;
  if (!n) {
    bar.classList.remove("show");
    return;
  }

  let total = 0;
  selected.forEach((id) => {
    const s = seats.find((x) => x.id === id);
    total += PREMIUM.includes(s?.row) ? PRICE_PREM : PRICE_STD;
  });

  document.getElementById("bSeats").textContent =
    `${n} ticket${n > 1 ? "s" : ""} \u00b7 ${[...selected].join(", ")}`;
  document.getElementById("bPrice").textContent =
    `\u20b9${total.toLocaleString("en-IN")}`;
  bar.classList.add("show");
}

function showToast(type, msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.className = `toast ${type}`;
  document.getElementById("toastTxt").textContent = msg;
  t.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("show"), 3200);
}

function checkLoginState() {
  // Added a safety check: Only run this if currentUser AND currentUser.name exist
  if (currentUser && currentUser.name) {
    document.getElementById("authBtns").style.display = "none";
    document.getElementById("userChip").style.display = "flex";

    const initials = currentUser.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    document.getElementById("uNm").textContent = currentUser.name.split(" ")[0];
    document.getElementById("uAv").textContent = initials;
  } else {
    // If the data is corrupted, clear it out silently so the app doesn't break
    localStorage.removeItem("chai_cinema_user");
    currentUser = null;
  }
}

window.openProfileModal = function () {
  // Added a fallback string just in case the name is missing
  if (!currentUser) return;

  const safeName = currentUser.name || "Guest User";
  const initials = safeName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  document.getElementById("pAv").textContent = initials;
  document.getElementById("pName").textContent = safeName;
  document.getElementById("pEmail").textContent =
    currentUser.email || "No Email";
  window.openModal("profileOv");
};

// ==========================================
// MODALS & TOGGLES
// ==========================================

window.openModal = function (id) {
  document.getElementById(id)?.classList.add("open");
  document.body.style.overflow = "hidden";
};
window.closeModal = function (id) {
  document.getElementById(id)?.classList.remove("open");
  document.body.style.overflow = "";
};
window.openAuthModal = function (tab) {
  window.switchTab(tab);
  window.openModal("authOv");
};
window.togglePw = function (id, btn) {
  const el = document.getElementById(id),
    hide = el.type === "text";
  el.type = hide ? "password" : "text";
  btn.textContent = hide ? "👁" : "🙈";
};

window.switchTab = function (tab) {
  const isLog = tab === "login",
    isReg = tab === "register",
    isForg = tab === "forgot";
  document.getElementById("loginForm").style.display = isLog ? "" : "none";
  document.getElementById("regForm").style.display = isReg ? "" : "none";
  document.getElementById("forgotForm").style.display = isForg ? "" : "none";
  document.getElementById("authTabs").style.display = isForg ? "none" : "flex";
  document.getElementById("tLogin")?.classList.toggle("active", isLog);
  document.getElementById("tReg")?.classList.toggle("active", isReg);
};

// ==========================================
// API WRAPPERS (Calling api.js)
// ==========================================

window.doLogin = async function (event) {
  event.preventDefault();
  const email = document.getElementById("lEmail")?.value.trim();
  const password = document.getElementById("lPw")?.value;
  const btn = document.getElementById("lBtn");

  if (!email || !password)
    return showToast("error", "Please enter both email and password.");
  const originalText = btn?.textContent;
  if (btn) {
    btn.textContent = "Signing in...";
    btn.disabled = true;
  }

  try {
    const response = await window.api.login({ email, password });

    // 1. Safely extract the data payload
    const payload = response.data.data;

    // 2. Handle both { data: { user: {...} } } AND { data: { id: 1, ... } }
    const user = payload.user || payload;

    // 3. Safely map specific database columns
    const finalName = user.full_name || user.name || user.email.split("@")[0];
    const finalId = user.user_id || user.id;

    // 4. Save to LocalStorage
    currentUser = { name: finalName, email: user.email, id: finalId };
    localStorage.setItem("chai_cinema_user", JSON.stringify(currentUser));

    // 5. Update UI
    checkLoginState();
    window.closeModal("authOv");
    showToast("success", `Welcome back, ${currentUser.name.split(" ")[0]}!`);
  } catch (error) {
    console.error("Login Error:", error);
    const errorMsg = error.response?.data?.message || "Login failed.";
    showToast("error", errorMsg);
  } finally {
    if (btn) {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  }
};

window.doRegister = async function (event) {
  event.preventDefault();
  const full_name = document.getElementById("rName")?.value.trim(),
    email = document.getElementById("rEmail")?.value.trim();
  const password = document.getElementById("rPw")?.value,
    confirm = document.getElementById("rCf")?.value;
  const btn = document.getElementById("rBtn");

  if (!full_name || !email || !password || !confirm)
    return showToast("error", "Fill all fields.");
  if (password !== confirm)
    return showToast("error", "Passwords do not match.");

  const originalText = btn?.textContent;
  if (btn) {
    btn.textContent = "Creating...";
    btn.disabled = true;
  }

  try {
    await window.api.register({ full_name, email, password });
    showToast("success", "Registration successful! Please sign in.");
    document.getElementById("regForm")?.reset();
    window.switchTab("login");
  } catch (error) {
    console.error("Registration Error:", error);
    showToast("error", error.response?.data?.message || "Registration failed.");
  } finally {
    if (btn) {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  }
};

window.logout = async function () {
  try {
    await window.api.logout();
    currentUser = null;
    localStorage.removeItem("chai_cinema_user"); // Clear storage

    selected.clear();
    document.getElementById("authBtns").style.display = "flex";
    document.getElementById("userChip").style.display = "none";
    document.getElementById("lEmail").value = "";
    document.getElementById("lPw").value = "";

    updateBar();
    renderGrid();
    showToast("info", "Signed out successfully.");
  } catch (error) {
    console.error("Logout Error:", error);
    showToast("error", "Failed to sign out properly.");
  }
};

async function fetchSeats() {
  renderSkeleton();
  try {
    const response = await window.api.getSeats(1);
    seats = response.data.data;
  } catch (error) {
    console.error("Failed to fetch seats", error);
    seats = ROWS.flatMap((row) =>
      Array.from({ length: COLS }, (_, i) => ({
        id: `${row}${i + 1}`,
        row,
        col: i + 1,
        bookedBy: null,
        isPremium: PREMIUM.includes(row),
      })),
    );
  }
  renderGrid();
}

window.handleConfirm = async function () {
  if (!currentUser || !selected.size) return;
  const btn = document.getElementById("payBtn");
  btn.innerHTML = '<span class="spin"></span>';
  btn.disabled = true;

  const ids = [...selected];
  let hasError = false;

  for (const seatNumber of ids) {
    try {
      await window.api.bookSeats({ showId: 1, seatNumber });
      const s = seats.find((x) => x.id === seatNumber);
      if (s) s.bookedBy = currentUser.name;
      selected.delete(seatNumber);
    } catch (error) {
      console.error("Booking Error:", error);
      hasError = true;
      showToast(
        "error",
        error.response?.data?.message || `Seat ${seatNumber} is taken!`,
      );
    }
  }

  btn.innerHTML = "Pay Now";
  btn.disabled = false;
  updateBar();
  renderGrid();
  if (!hasError)
    showToast("success", `Booking confirmed! ${ids.length} seat(s) reserved.`);
};

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  checkLoginState(); // Restores UI if user is in LocalStorage
  fetchSeats();

  document.querySelectorAll(".ov").forEach((o) =>
    o.addEventListener("click", (e) => {
      if (e.target === o) window.closeModal(o.id);
    }),
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape")
      document
        .querySelectorAll(".ov.open")
        .forEach((o) => window.closeModal(o.id));
  });
});
