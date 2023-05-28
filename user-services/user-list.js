const setEditModal = (id) => {
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", `http://localhost:5000/users/${id}`, false);
    xhttp.send();

    const user = JSON.parse(xhttp.responseText);

    const {
        name, 
        email
    } = user;

    document.getElementById('id').value = id;
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;

    // setting up the action url for the book
    document.getElementById('editForm').action = 'http://localhost:5000/users/${id}';
}

const deleteUser = (id) => {
    const xhttp = new XMLHttpRequest();

    xhttp.open("DELETE", 'http://localhost:5000/users/${id}', false);
    xhttp.send();

    location.reload();
}

const loadUsers = () => {
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", "http://localhost:5000/users", false);
    xhttp.send();

    const users = JSON.parse(xhttp.responseText);

    for (let user of users) {
        const x = `
            <div class="col-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${user.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${user.id}</h6>

                        <div>Email: ${user.email}</div>
                        <hr>

                        <button type="button" class="btn btn-danger">Delete</button>
                        <button types="button" class="btn btn-primary" data-toggle="modal" 
                            data-target="#editUserModal" onClick="setEditModal(${user.id})">
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        `

        document.getElementById('users').innerHTML = document.getElementById('users').innerHTML + x;
    }
}

loadUsers();