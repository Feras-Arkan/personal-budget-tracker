const API_BASE = "/api/transactions";
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const form = document.getElementById("transactionForm");
const formMessage = document.getElementById("formMessage");
const transactionsBody = document.getElementById("transactionsBody");
const summaryEl = document.getElementById("summary");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editIdInput = document.getElementById("editId");

const filterType = document.getElementById("filterType");
const filterCategory = document.getElementById("filterCategory");
const filterDateFrom = document.getElementById("filterDateFrom");
const filterDateTo = document.getElementById("filterDateTo");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
const expenseByCategoryChartEl = document.getElementById("expenseByCategoryChart");
const incomeExpenseChartEl = document.getElementById("incomeExpenseChart");

let allTransactions = [];
let expenseByCategoryChart = null;
let incomeExpenseChart = null;
let editingId = null;

function setMessage(text, type = "") {
  formMessage.textContent = text;
  formMessage.className = "message";
  if (type) {
    formMessage.classList.add(type);
  }
}

function resetFormToCreateMode() {
  editingId = null;
  editIdInput.value = "";
  submitBtn.textContent = "Add Transaction";
  cancelEditBtn.classList.add("hidden");
  form.reset();
  document.getElementById("date").valueAsDate = new Date();
}

function startEditTransaction(id) {
  const tx = allTransactions.find((item) => item.id === id);
  if (!tx) {
    setMessage("Transaction not found for editing.", "error");
    return;
  }

  editingId = id;
  editIdInput.value = String(id);
  document.getElementById("type").value = tx.type;
  document.getElementById("amount").value = tx.amount;
  document.getElementById("category").value = tx.category;
  document.getElementById("date").value = tx.date;
  document.getElementById("note").value = tx.note || "";
  submitBtn.textContent = "Update Transaction";
  cancelEditBtn.classList.remove("hidden");
  setMessage(`Editing transaction #${id}`, "success");
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function buildSummary(transactions) {
  const income = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const expense = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const balance = income - expense;

  summaryEl.innerHTML = `
    <span class="summary-pill">Transactions: ${transactions.length}</span>
    <span class="summary-pill">Income: ${currency.format(income)}</span>
    <span class="summary-pill">Expense: ${currency.format(expense)}</span>
    <span class="summary-pill">Balance: ${currency.format(balance)}</span>
  `;
}

function buildCharts(transactions) {
  const expensesOnly = transactions.filter((tx) => tx.type === "expense");
  const incomeTotal = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const expenseTotal = expensesOnly.reduce((sum, tx) => sum + tx.amount, 0);

  const expenseByCategoryMap = expensesOnly.reduce((acc, tx) => {
    const key = tx.category.trim() || "Other";
    acc[key] = (acc[key] || 0) + tx.amount;
    return acc;
  }, {});

  const categoryLabels = Object.keys(expenseByCategoryMap);
  const categoryValues = Object.values(expenseByCategoryMap);

  if (expenseByCategoryChart) {
    expenseByCategoryChart.destroy();
  }
  if (incomeExpenseChart) {
    incomeExpenseChart.destroy();
  }

  expenseByCategoryChart = new Chart(expenseByCategoryChartEl, {
    type: "pie",
    data: {
      labels: categoryLabels.length ? categoryLabels : ["No expense data"],
      datasets: [
        {
          data: categoryValues.length ? categoryValues : [1],
          backgroundColor: [
            "#2563eb",
            "#dc2626",
            "#16a34a",
            "#d97706",
            "#7c3aed",
            "#0891b2",
            "#db2777",
            "#4b5563",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });

  incomeExpenseChart = new Chart(incomeExpenseChartEl, {
    type: "bar",
    data: {
      labels: ["Income", "Expense"],
      datasets: [
        {
          label: "Amount",
          data: [incomeTotal, expenseTotal],
          backgroundColor: ["#16a34a", "#dc2626"],
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: { display: false },
      },
    },
  });
}

function getFilteredTransactions() {
  const typeValue = filterType.value;
  const categoryValue = filterCategory.value.trim().toLowerCase();
  const fromValue = filterDateFrom.value;
  const toValue = filterDateTo.value;

  return allTransactions.filter((tx) => {
    if (typeValue && tx.type !== typeValue) return false;
    if (categoryValue && !tx.category.toLowerCase().includes(categoryValue)) {
      return false;
    }
    if (fromValue && tx.date < fromValue) return false;
    if (toValue && tx.date > toValue) return false;
    return true;
  });
}

function renderTransactions(transactions) {
  if (!transactions.length) {
    transactionsBody.innerHTML = `
      <tr>
        <td colspan="7">No transactions found.</td>
      </tr>
    `;
    buildSummary(transactions);
    buildCharts(transactions);
    return;
  }

  transactionsBody.innerHTML = transactions
    .map(
      (tx) => `
        <tr>
          <td>${tx.id}</td>
          <td class="${tx.type}">${tx.type}</td>
          <td>${currency.format(tx.amount)}</td>
          <td>${tx.category}</td>
          <td>${formatDate(tx.date)}</td>
          <td>${tx.note || "-"}</td>
          <td>
            <div class="action-group">
              <button class="edit-btn" data-id="${tx.id}" type="button">Edit</button>
              <button class="delete-btn" data-id="${tx.id}" type="button">Delete</button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");

  buildSummary(transactions);
  buildCharts(transactions);
}

async function loadTransactions() {
  try {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error("Failed to load transactions.");

    allTransactions = await response.json();
    renderTransactions(getFilteredTransactions());
  } catch (error) {
    setMessage(error.message, "error");
  }
}

async function createTransaction(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = {
    type: formData.get("type"),
    amount: Number(formData.get("amount")),
    category: formData.get("category"),
    date: formData.get("date"),
    note: formData.get("note"),
  };

  try {
    const isEditMode = Number.isInteger(editingId) && editingId > 0;
    const endpoint = isEditMode ? `${API_BASE}/${editingId}` : API_BASE;
    const method = isEditMode ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Could not add transaction.");
    }

    resetFormToCreateMode();
    setMessage(
      isEditMode
        ? "Transaction updated successfully."
        : "Transaction added successfully.",
      "success"
    );
    await loadTransactions();
  } catch (error) {
    setMessage(error.message, "error");
  }
}

async function handleTableActions(event) {
  const editButton = event.target.closest(".edit-btn");
  if (editButton) {
    const id = Number(editButton.dataset.id);
    startEditTransaction(id);
    return;
  }

  const deleteButton = event.target.closest(".delete-btn");
  if (deleteButton) {
    const id = Number(deleteButton.dataset.id);
    const confirmed = window.confirm(
      `Delete transaction #${id}? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not delete transaction.");
      }
      if (editingId === id) {
        resetFormToCreateMode();
      }
      setMessage("Transaction deleted successfully.", "success");
      await loadTransactions();
    } catch (error) {
      setMessage(error.message, "error");
    }
  }
}

function applyFilters() {
  renderTransactions(getFilteredTransactions());
}

form.addEventListener("submit", createTransaction);
transactionsBody.addEventListener("click", handleTableActions);
filterType.addEventListener("change", applyFilters);
filterCategory.addEventListener("input", applyFilters);
filterDateFrom.addEventListener("change", applyFilters);
filterDateTo.addEventListener("change", applyFilters);
cancelEditBtn.addEventListener("click", () => {
  resetFormToCreateMode();
  setMessage("Edit canceled.", "success");
});
clearFiltersBtn.addEventListener("click", () => {
  filterType.value = "";
  filterCategory.value = "";
  filterDateFrom.value = "";
  filterDateTo.value = "";
  applyFilters();
});

resetFormToCreateMode();
loadTransactions();
