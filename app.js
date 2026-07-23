const STORAGE_KEY = "ledger-banking-demo-v2";
const starterData = {
    branches: [
        { id: "adelaide", name: "Adelaide", customers: [
            { id: "tim", name: "Tim", transactions: [50.05, 44.22, -18.90, 12.44] },
            { id: "mike", name: "Mike", transactions: [175.34, -32.50, 1.65] },
            { id: "percy", name: "Percy", transactions: [220.12] }
        ]},
        { id: "dublin", name: "Dublin Central", customers: [
            { id: "aoife", name: "Aoife Murphy", transactions: [420, -64.25, 75.50] },
            { id: "liam", name: "Liam Byrne", transactions: [310, -29.99] }
        ]}
    ]
};

const $ = (selector) => document.querySelector(selector);
const cloneStarter = () => JSON.parse(JSON.stringify(starterData));
let bank = load();
let branchId = bank.branches[0]?.id ?? null;
let customerId = null;
let toastTimer;

function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || cloneStarter(); }
    catch { return cloneStarter(); }
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(bank)); }
function uid(name) { return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`; }
function money(value) { return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(value); }
function selectedBranch() { return bank.branches.find(branch => branch.id === branchId); }
function balance(customer) { return customer.transactions.reduce((sum, value) => sum + value, 0); }
function safe(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function toast(message) {
    $("#toast").textContent = message;
    $("#toast").classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 2400);
}

function render() {
    const allCustomers = bank.branches.flatMap(branch => branch.customers);
    $("#total-balance").textContent = money(allCustomers.reduce((sum, customer) => sum + balance(customer), 0));
    $("#customer-count").textContent = allCustomers.length;
    $("#branch-count").textContent = bank.branches.length;

    const branchList = $("#branch-list");
    branchList.replaceChildren();
    bank.branches.forEach(branch => {
        const button = document.createElement("button");
        button.className = `branch-button${branch.id === branchId ? " active" : ""}`;
        button.innerHTML = `<strong>${safe(branch.name)}</strong><span>${branch.customers.length}</span>`;
        button.onclick = () => { branchId = branch.id; render(); };
        branchList.append(button);
    });

    const branch = selectedBranch();
    $("#branch-title").textContent = branch?.name || "Choose a branch";
    $("#add-customer").disabled = !branch;
    const body = $("#customer-list");
    body.replaceChildren();
    const empty = $("#empty-state");
    empty.classList.toggle("hidden", Boolean(branch?.customers.length));
    if (!branch) return;

    branch.customers.forEach(customer => {
        const row = document.createElement("tr");
        const currentBalance = balance(customer);
        row.innerHTML = `
            <td><span class="avatar">${safe(customer.name[0])}</span>${safe(customer.name)}</td>
            <td>${customer.transactions.length}</td>
            <td><strong class="${currentBalance < 0 ? "negative" : ""}">${money(currentBalance)}</strong></td>
            <td><button class="table-button history">History</button><button class="table-button transact">± Transaction</button></td>`;
        row.querySelector(".history").onclick = () => openHistory(customer.id);
        row.querySelector(".transact").onclick = () => openTransaction(customer.id);
        body.append(row);
    });
}

function openDialog(dialog, focus) {
    dialog.showModal();
    requestAnimationFrame(() => dialog.querySelector(focus)?.focus());
}

document.querySelectorAll("[data-open-branch]").forEach(button => button.onclick = () => {
    $("#branch-form").reset();
    $("#branch-error").textContent = "";
    openDialog($("#branch-modal"), "#branch-name");
});

$("#add-customer").onclick = () => {
    $("#customer-form").reset();
    $("#customer-error").textContent = "";
    openDialog($("#customer-modal"), "#customer-name");
};

$("#branch-form").onsubmit = event => {
    event.preventDefault();
    const name = $("#branch-name").value.trim();
    if (!name || bank.branches.some(branch => branch.name.toLowerCase() === name.toLowerCase())) {
        $("#branch-error").textContent = "Enter a unique branch name.";
        return;
    }
    const branch = { id: uid(name), name, customers: [] };
    bank.branches.push(branch);
    branchId = branch.id;
    save(); $("#branch-modal").close(); render(); toast(`${name} branch created`);
};

$("#customer-form").onsubmit = event => {
    event.preventDefault();
    const branch = selectedBranch();
    const name = $("#customer-name").value.trim();
    const amount = Number($("#initial-balance").value);
    if (!name || !Number.isFinite(amount) || amount <= 0 ||
        branch.customers.some(customer => customer.name.toLowerCase() === name.toLowerCase())) {
        $("#customer-error").textContent = "Enter a unique name and an initial deposit greater than zero.";
        return;
    }
    branch.customers.push({ id: uid(name), name, transactions: [amount] });
    save(); $("#customer-modal").close(); render(); toast(`${name} added to ${branch.name}`);
};

function openTransaction(id) {
    customerId = id;
    const customer = selectedBranch().customers.find(item => item.id === id);
    $("#transaction-customer").textContent = customer.name;
    $("#transaction-form").reset();
    $("#transaction-error").textContent = "";
    openDialog($("#transaction-modal"), "#transaction-amount");
}

$("#transaction-form").onsubmit = event => {
    event.preventDefault();
    const customer = selectedBranch().customers.find(item => item.id === customerId);
    const amount = Number($("#transaction-amount").value);
    if (!Number.isFinite(amount) || amount === 0) {
        $("#transaction-error").textContent = "Enter a positive or negative amount other than zero.";
        return;
    }
    customer.transactions.push(amount);
    save(); $("#transaction-modal").close(); render();
    toast(`${money(Math.abs(amount))} ${amount > 0 ? "added to" : "deducted from"} ${customer.name}`);
};

function openHistory(id) {
    const customer = selectedBranch().customers.find(item => item.id === id);
    $("#history-customer").textContent = customer.name;
    const list = $("#history-list");
    list.replaceChildren();
    customer.transactions.forEach((amount, index) => {
        const incoming = amount > 0;
        const row = document.createElement("div");
        row.className = "history-row";
        row.innerHTML = `<span>${incoming ? "Deposit" : "Withdrawal / payment"} ${index + 1}</span>
            <strong class="${incoming ? "" : "outgoing"}">${incoming ? "+" : "−"} ${money(Math.abs(amount))}</strong>`;
        list.append(row);
    });
    $("#history-modal").showModal();
}

document.querySelectorAll(".close").forEach(button => button.onclick = () => button.closest("dialog").close());
document.querySelectorAll("dialog").forEach(dialog => dialog.onclick = event => {
    if (event.target === dialog) dialog.close();
});
$("#reset-demo").onclick = () => {
    if (!confirm("Reset all branches and transactions to the sample data?")) return;
    bank = cloneStarter(); branchId = bank.branches[0].id; save(); render(); toast("Demo data restored");
};
render();
