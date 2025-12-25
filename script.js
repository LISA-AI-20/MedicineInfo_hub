let medicines = [];
let defaultMedicines = [];

/* ---------------- FETCH JSON ---------------- */
fetch("medicines.json")
  .then(res => res.json())
  .then(data => {
    medicines = data.medicines;

    // show first 6 on home
    defaultMedicines = medicines.slice(0, 6);
    render(defaultMedicines);
  })
  .catch(err => console.error("JSON error:", err));

/* ---------------- PRICE HELPER ---------------- */
function getPriceValue(price) {
  return parseInt(price.replace(/[₹\s,]/g, "").split("–")[0]);
}

/* ---------------- RENDER ---------------- */
function render(list) {
  const grid = document.getElementById("medicineGrid");
  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = "<p>No medicines found 😐</p>";
    return;
  }

  list.forEach(m => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${m.image}" alt="${m.name}">
      <span class="badge">${m.category}</span>
      <h3 style="margin-top:10px">${m.name}</h3>
      <p style="color:var(--muted); font-size:14px">${m.short}</p>
      <p style="font-weight:700; color:var(--primary); margin-top:10px">
        ${m.price}
      </p>
    `;

    card.onclick = () => showDetails(m);
    grid.appendChild(card);
  });
}

/* ---------------- FILTER + SEARCH + SORT ---------------- */
function applyFilters() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const category = document.getElementById("filterCategory").value;
  const age = document.getElementById("filterAge").value;
  const sort = document.getElementById("sortOrder").value;

  // 🟢 No search + no filter → show default medicines
  if (
    search === "" &&
    category === "all" &&
    age === "all" &&
    sort === "default"
  ) {
    render(defaultMedicines);
    return;
  }

  let filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(search) &&
    (category === "all" || m.category === category) &&
    (age === "all" || m.ageGroup.includes(age))
  );

  if (sort === "price-low") {
    filtered.sort((a, b) => getPriceValue(a.price) - getPriceValue(b.price));
  }

  if (sort === "price-high") {
    filtered.sort((a, b) => getPriceValue(b.price) - getPriceValue(a.price));
  }

  if (sort === "name-az") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  render(filtered);
}

/* ---------------- DETAILS MODAL ---------------- */
function showDetails(m) {
  const details = document.getElementById("detailsSection");

  details.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
      <img src="${m.image}" style="width:120px;border-radius:12px;">
      <button onclick="closeAll()" style="border:none;font-size:20px;">✕</button>
    </div>

    <div style="margin-top:15px;">
      <span class="badge">${m.category.toUpperCase()}</span>
      <div style="margin-top:10px;">${m.details}</div>
      <hr style="margin:15px 0;">
      <p><b>Price:</b> ${m.price}</p>
      <p><b>Dosage:</b> ${m.dosageLevel.toUpperCase()}</p>
      <p><b>Age:</b> ${m.ageGroup.join(", ")}</p>
    </div>
  `;

  details.classList.remove("hidden");
  document.getElementById("overlay").classList.add("active");
}

/* ---------------- UI CONTROLS ---------------- */
function openSidebar() {
  document.getElementById("sidebar").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}

function closeAll() {
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("detailsSection").classList.add("hidden");
  document.getElementById("overlay").classList.remove("active");
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function resetFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("filterCategory").value = "all";
  document.getElementById("filterAge").value = "all";
  document.getElementById("sortOrder").value = "default";
  render(defaultMedicines);
}

/* ---------------- SEARCH LISTENER ---------------- */
document
  .getElementById("searchInput")
  .addEventListener("input", applyFilters);
