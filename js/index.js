let employees = [];

const employeeTableBody = document.getElementById("employeeTableBody");
const departmentCount = document.getElementById("departmentCount");
const employeeForm = document.getElementById("employeeForm");
const employeeFormContainer = document.getElementById("employeeFormContainer");
const employeeTableContainer = document.getElementById(
    "employeeTableContainer"
);

// Binding event to button
document.getElementById("addEmployeeBtn").onclick = () => {
    employeeForm.reset();
    openEmployeeForm("Submit", -1);
};

document.getElementById("employeeFormCancelBtn").onclick = () =>
    closeEmployeeForm();

// Open and Close form
function openEmployeeForm(text, index) {
    document.getElementById("employeeIndex").value = index;
    document.getElementById("employeeFormSubmitBtn").innerText = text;
    employeeFormContainer.classList.remove("d-none");
}

function closeEmployeeForm() {
    employeeForm.reset();
    employeeFormContainer.classList.add("d-none");
}

// Form submit event
employeeForm.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("employeeName").value.trim();
    const department = document
        .getElementById("employeeDepartment")
        .value.trim();
    const phone = document.getElementById("employeePhone").value.trim();
    const index = +document.getElementById("employeeIndex").value;

    if (index === -1) {
        // Add new employee
        employees.push({ name, department, phone });
    } else {
        // Update existing employee
        employees[index] = { name, department, phone };
    }

    saveEmployeesToLocalStorage();
    closeEmployeeForm();
    renderEmployeeTable();
};

// Render employee table
function renderEmployeeTable() {
    employeeTableBody.innerHTML = "";
    employees.forEach((employee, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.department}</td>
            <td>${employee.phone}</td>
            <td>
                <div class="d-flex justify-content-around">
                    <img
                        class="icon"
                        src="img/edit.png"
                        class="img-fluid"
                        onclick="editEmployee(${index})"
                    />
                    <img
                        class="icon"
                        src="img/trash-can.png"
                        class="img-fluid"
                        data-toggle="modal"
                        data-target="#employeeDeleteModal"
                        onclick="deleteEmployee(${index})"
                    />
                </div>
            </td>
        `;
        employeeTableBody.appendChild(row);
    });
    updateDepartmentCount();
}

// Edit employee
function editEmployee(index) {
    const employee = employees[index];
    document.getElementById("employeeName").value = employee.name;
    document.getElementById("employeeDepartment").value = employee.department;
    document.getElementById("employeePhone").value = employee.phone;
    openEmployeeForm("Update", index);
}

// Delete employee
function deleteEmployee(index) {
    let btn = document.getElementById("deleteEmployeeModalBtn");
    btn.onclick = () => {
        employees.splice(index, 1);
        saveEmployeesToLocalStorage();
        $("#employeeDeleteModal").modal("hide");
        renderEmployeeTable();
    };
}

// Update department count
function updateDepartmentCount() {
    // Initialize department counts to zero
    const departmentCounts = {
        Administration: 0,
        "Customer Service": 0,
        "Human Resources": 0,
    };

    // Clear department count
    departmentCount.innerHTML = "";

    // Count the number of employees in each department
    employees.forEach((employee) => {
        if (departmentCounts.hasOwnProperty(employee.department)) {
            departmentCounts[employee.department]++;
        }
    });

    for (const index in departmentCounts) {
        const p = document.createElement("div");
        p.innerHTML = `${index}: ${departmentCounts[index]}`;
        departmentCount.appendChild(p);
    }
}

// Function to load employees from local storage
function loadEmployeesFromLocalStorage() {
    const storedEmployees = localStorage.getItem("employees");
    if (storedEmployees) {
        employees = JSON.parse(storedEmployees);
    }
    renderEmployeeTable();
}

// Function to save employees to local storage
function saveEmployeesToLocalStorage() {
    localStorage.setItem("employees", JSON.stringify(employees));
}

// Initial render
window.onload = function () {
    loadEmployeesFromLocalStorage();
    updateDepartmentCount();
};
