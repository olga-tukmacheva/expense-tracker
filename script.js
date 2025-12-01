// 1. Подключение Supabase
const supabaseUrl = "https://okadtkilapzeyedjpmgd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rYWR0a2lsYXB6ZXllZGpwbWdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyODUyMDcsImV4cCI6MjA3OTg2MTIwN30.EHRkMYQvGBl5KIVE9Ogmrr1mRSepSzNu0NQZAr7o2ho";

const client = supabase.createClient(supabaseUrl, supabaseKey);

// 2. Ловим отправку формы
document.getElementById("expense-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;
  const date = document.getElementById("date").value;

  // 3. Добавляем запись в таблицу
  const { data, error } = await client
    .from("expenses")
    .insert([
      { amount, category, description, created_at: date }
    ]);

  if (error) {
    alert("Ошибка сохранения: " + error.message);
    console.error(error);
  } else {
    alert("Расход добавлен!");
    e.target.reset();
  }
});
