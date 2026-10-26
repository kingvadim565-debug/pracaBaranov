// ===== Dane ofert (fikcyjne) =====
// salaryMin = przybliżona kwota miesięczna w zł, używana tylko do sortowania
const JOBS = [
  { id: 1,  title: "Junior Python Developer",   company: "DataForge",      category: "IT",           city: "Wrocław",  type: "Pełny etat",     salary: "7 000 – 9 500 zł",       salaryMin: 7000, desc: "Pisanie skryptów i małych usług w Pythonie, praca z bazami danych w zespole 6 osób." },
  { id: 2,  title: "Grafik UI/UX",              company: "PixelLab",       category: "IT",           city: "Zdalnie",  type: "B2B",            salary: "6 000 – 8 500 zł",       salaryMin: 6000, desc: "Projektowanie interfejsów aplikacji i stron w Figmie. Praca w pełni zdalna." },
  { id: 3,  title: "Specjalista wsparcia IT",   company: "HelpDesk Pro",   category: "IT",           city: "Kraków",   type: "Pełny etat",     salary: "5 500 – 7 000 zł",       salaryMin: 5500, desc: "Pomoc użytkownikom, konfiguracja komputerów i obsługa zgłoszeń. Szkolenie na start." },
  { id: 4,  title: "Kurier rowerowy",           company: "DostawaExpress", category: "Kurier",       city: "Wrocław",  type: "Umowa zlecenie", salary: "30 – 38 zł/h",           salaryMin: 4800, desc: "Dowóz jedzenia i paczek po centrum miasta. Elastyczny grafik, możliwość wypożyczenia roweru." },
  { id: 5,  title: "Kurier samochodowy",        company: "PaczkaGo",       category: "Kurier",       city: "Katowice", type: "B2B",            salary: "6 500 – 9 000 zł",       salaryMin: 6500, desc: "Dostawy paczek na stałej trasie. Wymagane prawo jazdy kat. B i własny samochód." },
  { id: 6,  title: "Kierowca taksówki",         company: "MiastoTaxi",     category: "Transport",    city: "Kraków",   type: "Umowa zlecenie", salary: "6 000 – 10 000 zł",      salaryMin: 6000, desc: "Przewóz pasażerów przez aplikację. Samochód firmowy lub własny, wypłaty co tydzień." },
  { id: 7,  title: "Kierowca autobusu",         company: "MPK Regio",      category: "Transport",    city: "Łódź",     type: "Pełny etat",     salary: "7 500 – 9 000 zł",       salaryMin: 7500, desc: "Obsługa linii miejskich, stały grafik, pakiet socjalny. Wymagane prawo jazdy kat. D." },
  { id: 8,  title: "Barista",                   company: "Kawiarnia Ziarno", category: "Gastronomia", city: "Wrocław", type: "Umowa zlecenie", salary: "27 – 32 zł/h",           salaryMin: 4300, desc: "Przygotowywanie kawy i obsługa gości. Szkolenie baristyczne w cenie, dobra atmosfera." },
  { id: 9,  title: "Kucharz",                   company: "Restauracja Piec", category: "Gastronomia", city: "Kraków",  type: "Pełny etat",     salary: "6 000 – 8 000 zł",       salaryMin: 6000, desc: "Praca na gorącej kuchni w restauracji kuchni polskiej. Doświadczenie mile widziane." },
  { id: 10, title: "Pracownik budowlany",       company: "BudMax",         category: "Budownictwo",  city: "Katowice", type: "Pełny etat",     salary: "6 500 – 9 000 zł",       salaryMin: 6500, desc: "Prace wykończeniowe i murarskie na budowach mieszkaniowych. Narzędzia zapewnia firma." },
  { id: 11, title: "Opiekun medyczny",          company: "Centrum Zdrowie", category: "Zdrowie",     city: "Łódź",     type: "Pełny etat",     salary: "5 800 – 7 500 zł",       salaryMin: 5800, desc: "Opieka nad pacjentami w centrum medycznym, praca zmianowa, dodatki za weekendy." },
  { id: 12, title: "Doradca klienta",           company: "TechMarket",     category: "Sprzedaż",     city: "Wrocław",  type: "Pełny etat",     salary: "5 000 – 7 000 zł + premia", salaryMin: 5000, desc: "Doradztwo przy zakupie elektroniki w sklepie stacjonarnym. Premie za wyniki zespołu." },
  { id: 13, title: "Fryzjer damski",            company: "Studio Nożyczki", category: "Usługi",      city: "Łódź",     type: "B2B",            salary: "5 500 – 9 000 zł",       salaryMin: 5500, desc: "Strzyżenie, koloryzacja i stylizacja w nowoczesnym salonie. Stała baza klientów." }
];

// ===== Elementy strony =====
const $ = id => document.getElementById(id);
const jobsEl = $("jobs"), emptyEl = $("empty"), countEl = $("count");
const searchEl = $("search"), cityEl = $("city"), sortEl = $("sort"), chipsEl = $("chips"), resetEl = $("reset");
const modal = $("modal"), form = $("form"), formJob = $("form-job"), formMsg = $("form-msg");
const submitBtn = $("submit"), closeBtn = $("close");

let activeCategory = "";
let selectedJob = null;

// ===== Start: statystyki, lista miast, kategorie =====
const categories = [...new Set(JOBS.map(j => j.category))].sort((a, b) => a.localeCompare(b, "pl"));
const cities = [...new Set(JOBS.map(j => j.city))].sort((a, b) => a.localeCompare(b, "pl"));

$("stat-jobs").textContent = JOBS.length;
$("stat-cats").textContent = categories.length;
$("stat-cities").textContent = cities.length;

cities.forEach(c => {
  const opt = document.createElement("option");
  opt.value = c;
  opt.textContent = c;
  cityEl.appendChild(opt);
});

function renderChips() {
  chipsEl.innerHTML = "";
  ["", ...categories].forEach(cat => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (cat === activeCategory ? " active" : "");
    b.textContent = cat || "Wszystkie";
    b.addEventListener("click", () => {
      activeCategory = cat;
      renderChips();
      render();
    });
    chipsEl.appendChild(b);
  });
}

// ===== Renderowanie ofert =====
function pill(text, grey) {
  const s = document.createElement("span");
  s.className = "pill" + (grey ? " pill--grey" : "");
  s.textContent = text;
  return s;
}

function render() {
  const q = searchEl.value.trim().toLowerCase();
  const city = cityEl.value;

  let list = JOBS.filter(j => {
    const text = `${j.title} ${j.company} ${j.city} ${j.category}`.toLowerCase();
    return (!q || text.includes(q)) && (!activeCategory || j.category === activeCategory) && (!city || j.city === city);
  });

  const sort = sortEl.value;
  if (sort === "salary-desc") list.sort((a, b) => b.salaryMin - a.salaryMin);
  if (sort === "salary-asc") list.sort((a, b) => a.salaryMin - b.salaryMin);
  if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title, "pl"));

  jobsEl.innerHTML = "";
  list.forEach(j => {
    const card = document.createElement("article");
    card.className = "job";

    const main = document.createElement("div");
    main.className = "job__main";
    const h3 = document.createElement("h3");
    h3.textContent = j.title;
    const company = document.createElement("p");
    company.className = "job__company";
    company.textContent = j.company;
    const meta = document.createElement("div");
    meta.className = "job__meta";
    meta.append(pill(j.category), pill(j.city, true), pill(j.type, true));
    main.append(h3, company, meta);

    const side = document.createElement("div");
    side.className = "job__side";
    const salary = document.createElement("span");
    salary.className = "job__salary";
    salary.textContent = j.salary;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn";
    btn.textContent = "Aplikuj";
    btn.addEventListener("click", () => openForm(j));
    side.append(salary, btn);

    const desc = document.createElement("p");
    desc.className = "job__desc";
    desc.textContent = j.desc;

    card.append(main, side, desc);
    jobsEl.appendChild(card);
  });

  emptyEl.hidden = list.length > 0;
  countEl.textContent = `Znaleziono ofert: ${list.length}`;
}

searchEl.addEventListener("input", render);
cityEl.addEventListener("input", render);
sortEl.addEventListener("input", render);
resetEl.addEventListener("click", () => {
  searchEl.value = "";
  cityEl.value = "";
  sortEl.value = "default";
  activeCategory = "";
  renderChips();
  render();
});

// ===== Formularz =====
function openForm(job) {
  selectedJob = job;
  form.reset();
  formMsg.textContent = "";
  formMsg.className = "form__msg";
  submitBtn.disabled = false;
  formJob.textContent = `${job.title} – ${job.company}`;
  modal.showModal();
}

closeBtn.addEventListener("click", () => modal.close());
modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });

function showMsg(text, ok) {
  formMsg.textContent = text;
  formMsg.className = "form__msg " + (ok ? "ok" : "err");
}

form.addEventListener("submit", async e => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "");

  if (!data.firstName.trim() || !data.lastName.trim()) return showMsg("Podaj imię i nazwisko.", false);
  if (!emailOk) return showMsg("Podaj poprawny adres e-mail.", false);
  if (data.about.trim().length < 10) return showMsg("Napisz o sobie przynajmniej kilka słów.", false);

  submitBtn.disabled = true;
  showMsg("Wysyłanie...", true);

  try {
    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        about: data.about.trim(),
        website: data.website,
        job: `${selectedJob.title} – ${selectedJob.company}`
      })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Coś poszło nie tak.");

    showMsg("Dziękujemy! Sprawdź skrzynkę e-mail (także spam) – wysłaliśmy potwierdzenie.", true);
    form.reset();
    setTimeout(() => modal.close(), 3500);
  } catch (err) {
    showMsg(err.message || "Błąd wysyłania. Spróbuj ponownie.", false);
    submitBtn.disabled = false;
  }
});

// ===== Start =====
$("year").textContent = new Date().getFullYear();
renderChips();
render();
