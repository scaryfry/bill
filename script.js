  window.addEventListener('DOMContentLoaded', () => {
    showContent(`
      <h2>Welcome to the Bill Management Dashboard</h2>
      <p>Select an option from the left menu to get started.</p>
    `);
  });
  function loadHome() {
    showContent(`
        <h2>Welcome to the Bill Management Dashboard</h2>
        <p>Select an option from the left menu to get started.</p>
    `);
}
function showContent(html) {
    const content = document.getElementById('content');
    content.innerHTML = html;
    content.style.display = 'block';

}
async function fetchBuyers() {
    try {
 const res = await fetch(`http://localhost:8080/sellers`, {
            method: 'GET',
            headers:
            {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        const data = await res.json();
        if(!res.ok){
            console.log(data.description);
            return;
        }
        return data;
    }
    catch (err) {
        console.error('Error fetching buyers:', err);
    };
}
async function FetchSellers() {
    try {
        const res = await fetch(`http://localhost:8080/buyers`, {
            method: 'GET',
            headers:
            {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        const data = await res.json();
        if(!res.ok){
            console.log(data.description);
            return;
        }
        return data;
    }
    catch (err) {
        console.error('Error fetching sellers:', err);
    }
}
async function FetchBills() {
    try {
        const res = await fetch(`http://localhost:8080/bills`, {
            method: 'GET',
            headers:
            {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        const data = await res.json();
        if(!res.ok){
            console.log(data.description);
            return;
        }
        return data;
    }
    catch (err) {
        console.error('Error fetching bills:', err);
    }
}

function showMessage(message) {
    alert(message);
}

function CreatePerson() {
    const personType = document.querySelector('select').value;
    const name = document.querySelector('input[placeholder="Name"]').value;
    const address = document.querySelector('input[placeholder="Address"]').value;
    const taxNumber = document.querySelector('input[placeholder="Tax Number"]').value;
    if (!name || !address || !taxNumber) {
        showMessage('Please fill in all fields');
        return;
    }
    if (personType === 'buyer') {
        fetch('http://localhost:8080/buyers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, address, taxNumber })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            showMessage('Buyer created successfully');
            return response.json();
        }
        )
    }
    else if (personType === 'seller') {
        fetch('http://localhost:8080/sellers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, address, taxNumber })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            showMessage('Seller created successfully');
            return response.json();
        }
        )
    }
}   
function addPerson() {
    showContent(`
        <h2>Add Person</h2>
        <select>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
        </select>
        <input type="text" placeholder="Name">
        <input type="text" placeholder="Address">
        <input type="text" placeholder="Tax Number">
        <button onclick="CreatePerson()">Create</button>
    `);

}

async function EditPerson() {
    const personType = document.querySelector('select').value;
    const id = document.querySelector('input[placeholder="Enter ID"]')?.value || document.querySelector('input[placeholder="ID"]')?.value;
    const name = document.querySelector('input[placeholder="New Name"]')?.value || document.querySelector('input[placeholder="Name"]')?.value;
    const address = document.querySelector('input[placeholder="New Address"]')?.value || document.querySelector('input[placeholder="Address"]')?.value;
    const taxNumber = document.querySelector('input[placeholder="New Tax Number"]')?.value || document.querySelector('input[placeholder="Tax Number"]')?.value;
    if (!id || !name || !address || !taxNumber) {
        showMessage('Please fill in all fields');
        return;
    }
    let url = '';
    if (personType === 'buyer') {
        url = `http://localhost:8080/buyers/${id}`;
    } else if (personType === 'seller') {
        url = `http://localhost:8080/sellers/${id}`;
    } else {
        showMessage('Invalid person type');
        return;
    }
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, address, taxNumber })
        });
        if (!response.ok) {
            showMessage('Failed to update person');
            return;
        }
        showMessage(`${personType.charAt(0).toUpperCase() + personType.slice(1)} updated successfully`);
        await UpdatePerson();
    } catch (err) {
        console.error('Error updating person:', err);
        showMessage('Error updating person');
    }
}

function prefillPersonForm(person, type) {
    if (!person) return;
    const idInput = document.querySelector('input[placeholder="Enter ID"]') || document.querySelector('input[placeholder="ID"]');
    if (idInput) idInput.value = person.id || '';
    const selectElem = document.querySelector('select');
    if (selectElem) selectElem.value = type || '';
    const nameInput = document.querySelector('input[placeholder="New Name"]') || document.querySelector('input[placeholder="Name"]');
    if (nameInput) nameInput.value = person.name || '';
    const addressInput = document.querySelector('input[placeholder="New Address"]') || document.querySelector('input[placeholder="Address"]');
    if (addressInput) addressInput.value = person.address || '';
    const taxNumberInput = document.querySelector('input[placeholder="New Tax Number"]') || document.querySelector('input[placeholder="Tax Number"]');
    if (taxNumberInput) taxNumberInput.value = person.taxNumber || '';
}

async function UpdatePerson() {
    const buyers = await fetchBuyers() || [];
    const sellers = await FetchSellers() || [];

    const buyersList = buyers.length
        ? `<table><tr><th>ID</th><th>Name</th><th>Address</th><th>Tax Number</th><th>Action</th></tr>${
            buyers.map(b => `<tr>
                <td>${b.id}</td>
                <td>${b.name}</td>
                <td>${b.address}</td>
                <td>${b.taxNumber}</td>
                <td><button class="edit" onclick='prefillPersonForm(${JSON.stringify(b)}, "seller")'>Edit</button></td>
            </tr>`).join('')
        }</table>`
        : '<p>No buyers found.</p>';

    const sellersList = sellers.length
        ? `<table><tr><th>ID</th><th>Name</th><th>Address</th><th>Tax Number</th><th>Action</th></tr>${
            sellers.map(s => `<tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.address}</td>
                <td>${s.taxNumber}</td>
                <td><button class="edit" onclick='prefillPersonForm(${JSON.stringify(s)}, "buyer")'>Edit</button></td>
            </tr>`).join('')
        }</table>`
        : '<p>No sellers found.</p>';

    showContent(`
        <h2>Edit Person</h2>
        <div>
            <h3>Sellers</h3>
            ${buyersList}
            <h3>Buyers</h3>
            ${sellersList}
        </div>
        <select diabled>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
        </select>
        <input type="text" placeholder="Enter ID">
        <input type="text" placeholder="New Name">
        <input type="text" placeholder="New Address">
        <input type="text" placeholder="New Tax Number">
        <button onclick="EditPerson()">Update</button>
    `);
}

async function RemovePerson() {
    try {
        const personType = document.querySelector('#personTypeSelect').value;
        const id = document.querySelector('#deleteIdInput').value;

        if (!id) {
            showMessage('Please fill in fields');
            return;
        }

        const url = `http://localhost:8080/${personType}s/${id}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            showMessage(`Failed to delete ${personType}`);
            return;
        }
        deletePerson();
        showMessage(`Person has been deleted successfully`);
    } catch (error) {
        console.error(error);
        showMessage('An error occurred while deleting.');
    }
}
async function deletePerson() {
    const buyers = await fetchBuyers() || [];
    const sellers = await FetchSellers() || [];

    const buyersList = buyers.length
        ? `<table><tr><th>ID</th><th>Name</th><th>Address</th><th>Tax Number</th></tr>${
            buyers.map(b => `<tr><td>${b.id}</td><td>${b.name}</td><td>${b.address}</td><td>${b.taxNumber}</td></tr>`).join('')
        }</table>`
        : '<p>No buyers found.</p>';

    const sellersList = sellers.length
        ? `<table><tr><th>ID</th><th>Name</th><th>Address</th><th>Tax Number</th></tr>${
            sellers.map(s => `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.address}</td><td>${s.taxNumber}</td></tr>`).join('')
        }</table>`
        : '<p>No sellers found.</p>';

    showContent(`
        <h2>Delete Person</h2>
        <div>
            <h3>Sellers</h3>
            <ul>${buyersList}</ul>
            <h3>Buyers</h3>
            <ul>${sellersList}</ul>
        </div>
        <select id="personTypeSelect">
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
        </select>
        <input type="text" id="deleteIdInput" placeholder="Enter ID to delete">
        <button onclick="RemovePerson()">Delete</button>
    `);
}
async function addBill() {
    const buyers = await fetchBuyers() || [];
    const sellers = await FetchSellers() || [];
    const bills = await FetchBills() || [];

    const buyersList = buyers.length
        ? `<table><tr><th>ID</th><th>Name</th><th>Address</th><th>Tax Number</th></tr>${
            buyers.map(b => `<tr><td>${b.id}</td><td>${b.name}</td><td>${b.address}</td><td>${b.taxNumber}</td></tr>`).join('')
        }</table>`
        : '<p>No buyers found.</p>';

    const sellersList = sellers.length
        ? `<table><tr><th>ID</th><th>Name</th><th>Address</th><th>Tax Number</th></tr>${
            sellers.map(s => `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.address}</td><td>${s.taxNumber}</td></tr>`).join('')
        }</table>`
        : '<p>No sellers found.</p>';
    
    const billsList = bills.length
        ? `<table><tr><th>Bill number</th><th>Creation Date</th><th>Completed date</th><th>Deadline</th><th>Total</th><th>VAT</th></tr>${
            bills.map(b => `<tr><td>${b.billNumber}</td><td>${b.created}</td><td>${b.completed_date}</td><td>${b.deadline}</td><td>${b.total}</td><td>${b.vat}</td></tr>`).join('')
        }</table>`
        : '<p>No bills found.</p>';
    showContent(`
        <h2>Add Bill</h2>
        <div>
            <h3>Buyers</h3>
            <ul>${buyersList}</ul>
            <h3>Sellers</h3>
            <ul>${sellersList}</ul>
            <h3>Bills</h3>
            <ul>${billsList}</ul>
        </div>
        <input type="text" placeholder="Buyer ID">
        <input type="text" placeholder="Seller ID">
        <input type="text" placeholder="Bill number">
        <input type="date" placeholder="Creation Date">
        <input type="date" placeholder="Completed date">
        <input type="date" placeholder="Deadline">
        <input type="number" placeholder="Total">
        <input type="number" placeholder="VAT">
        <button onclick="createBill()">Create Bill</button>
    `);
}

function createBill() {
    const buyerId = document.querySelector('input[placeholder="Buyer ID"]').value;
    const sellerId = document.querySelector('input[placeholder="Seller ID"]').value;
    const billNumber = document.querySelector('input[placeholder="Bill number"]').value;
    const created = document.querySelector('input[placeholder="Creation Date"]').value;
    const completed_date = document.querySelector('input[placeholder="Completed date"]').value;
    const deadline = document.querySelector('input[placeholder="Deadline"]').value;
    const total = document.querySelector('input[placeholder="Total"]').value;
    const vat = document.querySelector('input[placeholder="VAT"]').value;

    if (!buyerId || !sellerId || !billNumber || !created || !completed_date || !deadline || !total || !vat) {
        showMessage('Please fill in all fields');
        return;
    }
    try {
        fetch('http://localhost:8080/bills', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                buyerId,
                sellerId,
                billNumber,
                created,
                completed_date,
                deadline,
                total,
                vat
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            showMessage('Bill created successfully');
            addBill();
            return response.json();
        });
    } catch (err) {
        console.error('Error creating bill:', err);
        showMessage('Error creating bill');
    }
}
async function editBill() {
    const buyers = await fetchBuyers() || [];
    const sellers = await FetchSellers() || [];
    const bills = await FetchBills() || [];

    const buyersList = buyers.length
        ? `<table><tr><th>ID</th><th>Name</th><th>Address</th><th>Tax Number</th></tr>${
            buyers.map(b => `<tr><td>${b.id}</td><td>${b.name}</td><td>${b.address}</td><td>${b.taxNumber}</td></tr>`).join('')
        }</table>`
        : '<p>No buyers found.</p>';

    const sellersList = sellers.length
        ? `<table><tr><th>ID</th><th>Name</th><th>Address</th><th>Tax Number</th></tr>${
            sellers.map(s => `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.address}</td><td>${s.taxNumber}</td></tr>`).join('')
        }</table>`
        : '<p>No sellers found.</p>';

    const billsList = bills.length
        ? `<table><tr><th>Seller ID</th><th>Buyer ID</th><th>Bill number</th><th>Creation Date</th><th>Completed date</th><th>Deadline</th><th>Total</th><th>VAT</th><th>Action</th></tr>${
            bills.map(b => `<tr>
                <td>${b.sellerId}</td>
                <td>${b.buyerId}</td>
                <td>${b.billNumber}</td>
                <td>${b.created}</td>
                <td>${b.completed_date}</td>
                <td>${b.deadline}</td>
                <td>${b.total}</td>
                <td>${b.vat}</td>
                <td><button class="edit" onclick='prefillBillForm(${JSON.stringify(b)})'>Edit</button></td>
            </tr>`).join('')
        }</table>`
        : '<p>No bills found.</p>';

    showContent(`
        <h2>Edit Bill</h2>
        <div>
            <h3>Buyers</h3>
            ${buyersList}
            <h3>Sellers</h3>
            ${sellersList}
            <h3>Bills</h3>
            ${billsList}
        </div>
        <input id="id" type="hidden" placeholder="ID">
        <input id="buyerId" type="text" placeholder="Buyer ID">
        <input id="sellerId" type="text" placeholder="Seller ID">
        <input id="billNumber" type="text" placeholder="Bill number">
        <input id="created" type="date" placeholder="Creation Date">
        <input id="completedDate" type="date" placeholder="Completed date">
        <input id="deadline" type="date" placeholder="Deadline">
        <input id="total" type="number" placeholder="Total">
        <input id="vat" type="number" placeholder="VAT">
        <button onclick="updateBill()">Update Bill</button>
    `);
}
function prefillBillForm(bill) {
    document.getElementById('id').value = bill.id;
    document.getElementById('buyerId').value = bill.buyerId;
    document.getElementById('sellerId').value = bill.sellerId;
    document.getElementById('billNumber').value = bill.billNumber;
    document.getElementById('created').value = bill.created;
    document.getElementById('completedDate').value = bill.completed_date;
    document.getElementById('deadline').value = bill.deadline;
    document.getElementById('total').value = bill.total;
    document.getElementById('vat').value = bill.vat;
}
function updateBill() {
    const id = document.getElementById('id').value;
    const buyerId = document.getElementById('buyerId').value;
    const sellerId = document.getElementById('sellerId').value;
    const billNumber = document.getElementById('billNumber').value;
    const created = document.getElementById('created').value;
    const completed_date = document.getElementById('completedDate').value;
    const deadline = document.getElementById('deadline').value;
    const total = document.getElementById('total').value;
    const vat = document.getElementById('vat').value;
    if (!buyerId || !sellerId || !billNumber || !created || !completed_date || !deadline || !total || !vat) {
        showMessage('Please fill in all fields');
        return;
    }
    try {
    fetch(`http://localhost:8080/bills/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id,
            buyerId,
            sellerId,
            billNumber,
            created,
            completed_date,
            deadline,
            total,
            vat
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        showMessage('Bill updated successfully');
        editBill();
        return response.json();
    });
    }
    catch (err) {
        console.error('Error updating bill:', err);
        showMessage('Error updating bill');
    }
}
async function deleteBill() {
    const buyers = await fetchBuyers() || [];
    const sellers = await FetchSellers() || [];
    const bills = await FetchBills() || [];
    const billsList = bills.length
        ? `<table><tr><th>Seller ID</th><th>Buyer ID</th><th>Bill number</th><th>Creation Date</th><th>Completed date</th><th>Deadline</th><th>Total</th><th>VAT</th><th>Action</th></tr>${
            bills.map(b => `<tr>
                <td>${b.sellerId}</td>
                <td>${b.buyerId}</td>
                <td>${b.billNumber}</td>
                <td>${b.created}</td>
                <td>${b.completed_date}</td>
                <td>${b.deadline}</td>
                <td>${b.total}</td>
                <td>${b.vat}</td>
                <td><button class="delete" onclick='removeBill(${b.id})'>Delete</button></td>
            </tr>`).join('')
        }</table>`
        : '<p>No bills found.</p>';

    showContent(`
        <h2>Delete Bill</h2>
        <div>
            <h3>Bills</h3>
            ${billsList}
        </div>
    `);
}

async function removeBill(id) {
    if (!id) {
        showMessage('Invalid bill ID');
        return;
    }
    try {
        const response = await fetch(`http://localhost:8080/bills/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            showMessage('Failed to delete bill');
            return;
        }
        showMessage('Bill deleted successfully');
        deleteBill();
    } catch (err) {
        console.error('Error deleting bill:', err);
        showMessage('Error deleting bill');
    }
}
    