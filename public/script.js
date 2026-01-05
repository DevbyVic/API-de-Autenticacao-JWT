const apiBase = window.location.origin; // base da API (mesmo host/porta do backend)
const toast = document.getElementById("toast");
const tokenBox = document.getElementById("token-info");
const copyBtn = document.getElementById("copy-token");
const clearBtn = document.getElementById("clear-token");
const userResult = document.getElementById("user-result");

function showToast(message, type = "info") {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3200);
}

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
  renderToken();
}

function clearToken() {
  localStorage.removeItem("token");
  renderToken();
}

function renderToken() {
  const token = getToken();
  if (!token) {
    tokenBox.textContent = "Nenhum token salvo.";
    tokenBox.classList.add("muted");
    return;
  }
  tokenBox.textContent = token;
  tokenBox.classList.remove("muted");
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${apiBase}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.msg || "Erro na requisição";
    throw new Error(msg);
  }
  return data;
}

document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = Object.fromEntries(form.entries());
    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      showToast(data.msg || "Registrado!", "success");
      e.target.reset();
    } catch (err) {
      showToast(err.message, "error");
    }
  });

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const payload = Object.fromEntries(form.entries());
  try {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (data.token) setToken(data.token);
    showToast(data.msg || "Login ok!", "success");
  } catch (err) {
    showToast(err.message, "error");
  }
});

document.getElementById("user-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = new FormData(e.target).get("id");
  userResult.textContent = "// carregando...";
  try {
    const data = await apiFetch(`/user/${id}`);
    userResult.textContent = JSON.stringify(data, null, 2);
    showToast("Usuário carregado", "success");
  } catch (err) {
    userResult.textContent = `// erro: ${err.message}`;
    showToast(err.message, "error");
  }
});

copyBtn.addEventListener("click", async () => {
  const token = getToken();
  if (!token) {
    showToast("Nenhum token para copiar", "error");
    return;
  }
  try {
    await navigator.clipboard.writeText(token);
    showToast("Token copiado", "success");
  } catch (err) {
    showToast("Não foi possível copiar", "error");
  }
});

clearBtn.addEventListener("click", () => {
  clearToken();
  showToast("Token removido", "info");
});

renderToken();
