// --------------------------------------
// 1. Подключение Supabase
// --------------------------------------
const supabaseUrl = "https://okadtkilapzeyedjpmgd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rYWR0a2lsYXB6ZXllZGpwbWdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyODUyMDcsImV4cCI6MjA3OTg2MTIwN30.EHRkMYQvGBl5KIVE9Ogmrr1mRSepSzNu0NQZAr7o2ho";

const client = supabase.createClient(supabaseUrl, supabaseKey);

// --------------------------------------
// 2. Добавление новой траты
// --------------------------------------
document.getElementById("expense-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = Number(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;
  const date = document.getElementById("date").value;

  const { data, error } = await client.from("expenses").insert([
    { amount, category, description, created_at: date }
  ]);

  if (error) {
    alert("Ошибка: " + error.message);
  } else {
    e.target.reset();
    loadExpenses();
    alert("Расход добавлен!");
  }
});

// --------------------------------------
// 3. Загрузка всех затрат
// --------------------------------------
async function loadExpenses() {
  const { data, error } = await client
    .from("expenses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Ошибка загрузки:", error);
    return;
  }

  renderExpenses(data);
  renderStats(data);
}

// --------------------------------------
// 4. Отображение списка расходов
// --------------------------------------
let currentFilter = "all";

function renderExpenses(expenses) {
  const list = document.getElementById("expenses-list");
  list.innerHTML = "";

  let filtered = currentFilter === "all"
    ? expenses
    : expenses.filter(x => x.category === currentFilter);

  filtered.slice(0, 10).forEach((item) => {
    const div = document.createElement("div");
    div.className = "expense-item show";

    div.innerHTML = `
      <strong>${capitalize(item.category)}</strong>
      <div>${item.description || "Без описания"}</div>
      <div><strong>${item.amount} ₽</strong></div>
      <small>${new Date(item.created_at).toLocaleDateString()}</small>
    `;

    list.appendChild(div);
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --------------------------------------
// 5. Фильтр по категориям
// --------------------------------------
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");
    currentFilter = btn.dataset.cat;

    loadExpenses();
  });
});

// --------------------------------------
// 6. Статистика
// --------------------------------------
function renderStats(expenses) {
  let total = 0;
  const catStats = {
    "еда": 0,
    "транспорт": 0,
    "развлечения": 0,
    "другое": 0,
  };

  expenses.forEach((x) => {
    total += x.amount;
    catStats[x.category] += x.amount;
  });

  document.getElementById("total-sum").textContent = total + " ₽";

  Object.keys(catStats).forEach(cat => {
    document.getElementById(`stat-${cat}`).textContent = catStats[cat] + " ₽";
  });
}

// --------------------------------------
// 7. Старт
// --------------------------------------
loadExpenses();
