async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("loginError");

  errorBox.textContent = "";

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      errorBox.textContent = data.error || "Login failed";
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "/dashboard";
  } catch (error) {
    errorBox.textContent = "Network error";
  }
}