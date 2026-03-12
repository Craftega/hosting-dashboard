function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`
  };
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

async function loadServers() {
  const wrap = document.getElementById("servers");
  wrap.innerHTML = "Loading servers...";

  try {
    const response = await fetch("/api/servers", {
      headers: authHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      wrap.innerHTML = `<p class="error">${data.error || "Failed to load servers"}</p>`;
      return;
    }

    wrap.innerHTML = "";

    data.data.forEach((item) => {
      const s = item.attributes;

      const card = document.createElement("div");
      card.className = "server-card";
      card.innerHTML = `
        <h3>${s.name}</h3>
        <p><strong>Identifier:</strong> ${s.identifier}</p>
        <p><strong>ID:</strong> ${s.id}</p>
        <p><strong>Memory:</strong> ${s.limits.memory} MB</p>
        <p><strong>CPU:</strong> ${s.limits.cpu}%</p>
        <div class="actions">
          <button onclick="powerAction('${s.identifier}', 'start')">Start</button>
          <button onclick="powerAction('${s.identifier}', 'stop')">Stop</button>
          <button onclick="powerAction('${s.identifier}', 'restart')">Restart</button>
          <button onclick="showStats('${s.identifier}')">Stats</button>
          <button onclick="showConsole('${s.identifier}')">Console</button>
          <button onclick="manageAccess('${s.identifier}')">Access</button>
        </div>
        <div id="extra-${s.identifier}" class="extra"></div>
      `;
      wrap.appendChild(card);
    });
  } catch (error) {
    wrap.innerHTML = `<p class="error">Network error</p>`;
  }
}

async function powerAction(identifier, signal) {
  const response = await fetch(`/api/servers/${identifier}/power`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ signal })
  });

  const data = await response.json();
  alert(data.message || data.error || "Done");
}

async function showStats(identifier) {
  const box = document.getElementById(`extra-${identifier}`);
  box.innerHTML = "Loading stats...";

  const response = await fetch(`/api/servers/${identifier}/resources`, {
    headers: authHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    box.innerHTML = `<p class="error">${data.error || "Failed to load stats"}</p>`;
    return;
  }

  const resources = data.attributes?.resources || data.attributes || {};

  box.innerHTML = `
    <p><strong>Current State:</strong> ${data.attributes?.current_state || "unknown"}</p>
    <p><strong>Memory Bytes:</strong> ${resources.memory_bytes ?? "n/a"}</p>
    <p><strong>CPU Absolute:</strong> ${resources.cpu_absolute ?? "n/a"}</p>
    <p><strong>Disk Bytes:</strong> ${resources.disk_bytes ?? "n/a"}</p>
  `;
}

async function showConsole(identifier) {
  const box = document.getElementById(`extra-${identifier}`);
  box.innerHTML = "Loading console info...";

  const response = await fetch(`/api/servers/${identifier}/console`, {
    headers: authHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    box.innerHTML = `<p class="error">${data.error || "Failed to load console info"}</p>`;
    return;
  }

  box.innerHTML = `
    <p><strong>Socket URL:</strong> ${data.data?.socket || "n/a"}</p>
    <p><strong>Token:</strong> ${data.data?.token || "n/a"}</p>
  `;
}

async function manageAccess(identifier) {
  const email = prompt("Enter user email to add access:");
  if (!email) return;

  const permissions = [
    "control.console",
    "control.start",
    "control.stop",
    "control.restart",
    "websocket.connect"
  ];

  const response = await fetch(`/api/servers/${identifier}/access`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, permissions })
  });

  const data = await response.json();
  alert(data.error || "Access added");
}

async function createUser() {
  const payload = {
    email: document.getElementById("u_email").value.trim(),
    username: document.getElementById("u_username").value.trim(),
    first_name: document.getElementById("u_first").value.trim(),
    last_name: document.getElementById("u_last").value.trim(),
    password: document.getElementById("u_password").value.trim()
  };

  const response = await fetch("/api/users", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  alert(data.error || "User created");
}

async function createServer() {
  const payload = {
    name: document.getElementById("s_name").value.trim(),
    user: Number(document.getElementById("s_user").value.trim()),
    egg: Number(document.getElementById("s_egg").value.trim()),
    node: Number(document.getElementById("s_node").value.trim()),
    docker_image: "ghcr.io/pterodactyl/yolks:java_21",
    startup: "java -Xms128M -XX:MaxRAMPercentage=95.0 -jar {{SERVER_JARFILE}}",
    environment: {
      SERVER_JARFILE: "server.jar",
      MINECRAFT_VERSION: "latest",
      BUILD_NUMBER: "latest"
    },
    limits: {
      memory: Number(document.getElementById("s_memory").value.trim()),
      swap: 0,
      disk: Number(document.getElementById("s_disk").value.trim()),
      io: 500,
      cpu: Number(document.getElementById("s_cpu").value.trim())
    },
    feature_limits: {
      databases: 0,
      allocations: 0,
      backups: 0
    },
    allocation: {
      default: Number(document.getElementById("s_allocation").value.trim())
    }
  };

  const response = await fetch("/api/servers", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  alert(data.error || "Server created");
  loadServers();
}

if (!getToken()) {
  window.location.href = "/";
} else {
  loadServers();
}