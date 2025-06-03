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
    const id = document.querySelector('input[placeholder="Enter ID"]').value;
    const name = document.querySelector('input[placeholder="New Name"]').value;
    const address = document.querySelector('input[placeholder="New Address"]').value;
    const taxNumber = document.querySelector('input[placeholder="New Tax Number"]').value;
    if (!name || !address || !taxNumber) {
        showMessage('Please fill in all fields');
        return;
    }
    if (personType === 'buyer') {
        await fetch(`http://localhost:8080/buyers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, address, taxNumber })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            showMessage('Buyer updated successfully');
            return response.json();
        }
        )
    }
    else if (personType === 'seller') {
        await fetch(`http://localhost:8080/sellers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, address, taxNumber })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            showMessage('Seller updated successfully');
            return response.json();
        }
        )
    }
}
async function UpdatePerson() {
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
        <h2>Edit Person</h2>
        <div>
            <h3>Buyers</h3>
            <ul>${sellersList}</ul>
            <h3>Sellers</h3>
            <ul>${buyersList}</ul>
        </div>
        <select>
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
            <h3>Buyers</h3>
            <ul>${sellersList}</ul>
            <h3>Sellers</h3>
            <ul>${buyersList}</ul>
        </div>
        <select id="personTypeSelect">
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
        </select>
        <input type="text" id="deleteIdInput" placeholder="Enter ID to delete">
        <button onclick="RemovePerson()">Delete</button>
    `);
}
function addBill() {
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
        <h2>Add Bill</h2>
        <div>
            <h3>Buyers</h3>
            <ul>${sellersList}</ul>
            <h3>Sellers</h3>
            <ul>${buyersList}</ul>
        </div>
        <input type="text" placeholder="Buyer ID">
        <input type="text" placeholder="Seller ID">
        <input type="number" placeholder="Amount">
        <input type="date">
        <button onclick="createBill()">Create Bill</button>
    `);
}
function createBill() {
    const buyerName = document.querySelector('input[placeholder="Buyer Name"]').value;
    const sellerName = document.querySelector('input[placeholder="Seller Name"]').value;
    const amount = document.querySelector('input[placeholder="Amount"]').value;
    const date = document.querySelector('input[type="date"]').value;
    if (!buyerName || !sellerName || !amount || !date) {
        showMessage('Please fill in all fields');
        return;
    }
    try{    
    fetch('http://localhost:8080/bills', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ buyerName, sellerName, amount, date })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        showMessage('Bill created successfully');
        return response.json();
    })
    }
    catch (err) {
        console.error('Error creating bill:', err);
        showMessage('Error creating bill');
    }
}