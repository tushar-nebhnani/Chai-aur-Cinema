const API_BASE_URL = "http://localhost:4000/bookmyshow";

async function doLogin(event) {
  event.preventDefault();

  const email = document.getElementById("lEmail")?.value.trim();
  const password = document.getElementById("lPw")?.value;
  const btn = document.getElementById("lBtn");
  const originalText = btn?.textContent;

  if (!email || !password) {
    showToast("error", "Please enter both email and password.");
    return;
  }

  if (btn) {
    btn.textContent = "Signing in...";
    btn.disabled = true;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(
        "error",
        data.message ||
          data.error ||
          "Login failed. Please check your credentials.",
      );
      return;
    }

    // const user = data.data?.user || { name: email.split("@")[0], email };
    // loginUser({
    //   name: user.name || email.split("@")[0],
    //   email: user.email || email,
    // });
    // closeModal("authOv");
    // showToast(
    //   "success",
    //   `Welcome back, ${user.name?.split(" ")[0] || "Guest"}!`,
    // );
  } catch (error) {
    console.error("Login API error:", error);
    showToast("error", "Unable to reach the server. Try again later.");
  }
}

async function doRegister(event) {
  event.preventDefault();

  const username = document.getElementById("rName")?.value.trim();
  const email = document.getElementById("rEmail")?.value.trim();
  const password = document.getElementById("rPw")?.value;
  const confirm = document.getElementById("rCf")?.value;
  const btn = document.getElementById("rBtn");
  const originalText = btn?.textContent;

  if (!username || !email || !password || !confirm) {
    showToast("error", "Please fill in all registration fields.");
    return;
  }

  if (password !== confirm) {
    showToast("error", "Passwords do not match.");
    return;
  }

  if (btn) {
    btn.textContent = "Creating...";
    btn.disabled = true;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(
        "error",
        data.message || data.error || "Registration failed. Please try again.",
      );
      return;
    }

    showToast("success", "Registration successful! Please sign in.");
    document.getElementById("regForm")?.reset();
    switchTab("login");
  } catch (error) {
    console.error("Register API error:", error);
    showToast("error", "Unable to reach the server. Try again later.");
  } finally {
    if (btn) {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  }
}
