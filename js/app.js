let allRequests = [];

async function checkUserSession() {

    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();

    if (error) {
        console.error("Session error:", error);
        window.location.href = "login.html";
        return null;
    }

    if (!session) {
        window.location.href = "login.html";
        return null;
    }

    return session;
}



async function loadRequests() {

    const tableBody = document.getElementById("requestTableBody");

    tableBody.innerHTML = `
        <tr>
            <td colspan="9" class="empty-message">
                Loading requests...
            </td>
       </tr>
    `;

    const { data, error } = await supabaseClient
        .from("service_requests")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        console.error("Error loading requests:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="empty-message">
                    Error loading requests: ${escapeHTML(error.message)}
                </td>
            </tr>
        `;

        return;
    }

    allRequests = data || [];

    updateDashboard(allRequests);

    displayRequests(allRequests);
}


function displayRequests(requests) {

    const tableBody = document.getElementById("requestTableBody");

    tableBody.innerHTML = "";

    if (!requests || requests.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="empty-message">
                    No service requests found.
                </td>
            </tr>
        `;

        return;
    }


    requests.forEach(function (request) {

        const row = document.createElement("tr");

        const formattedDate = formatDate(request.created_at);

        row.innerHTML = `
            <td>${escapeHTML(String(request.id))}</td>

            <td>${escapeHTML(request.requester_name)}</td>

            <td>${escapeHTML(request.department)}</td>

            <td>${escapeHTML(request.category)}</td>

            <td>${escapeHTML(request.description)}</td>

            <td>
                <span class="priority-badge priority-${request.priority.toLowerCase()}">
                    ${escapeHTML(request.priority)}
                </span>
            </td>

            <td>
                <span class="status-badge status-${request.status.toLowerCase().replace(/\s+/g, "-")}">
                    ${escapeHTML(request.status)}
                </span>
            </td>

            <td>${formattedDate}</td>

            <td class="action-buttons">

                <button
                    class="btn-edit"
                    onclick="editRequest(${request.id})"
                >
                    Edit
                </button>

                <button
                    class="btn-delete"
                    onclick="deleteRequest(${request.id})"
                >
                    Delete
                </button>

            </td>
        `;

        tableBody.appendChild(row);

    });
}


function updateDashboard(requests) {

    const total = requests.length;

    const pending = requests.filter(function (request) {
        return request.status === "Pending";
    }).length;

    const inProgress = requests.filter(function (request) {
        return request.status === "In Progress";
    }).length;

    const completed = requests.filter(function (request) {
        return request.status === "Completed";
    }).length;


    document.getElementById("totalRequests").textContent = total;

    document.getElementById("pendingRequests").textContent = pending;

    document.getElementById("inProgressRequests").textContent = inProgress;

    document.getElementById("completedRequests").textContent = completed;
}

async function saveRequest(event) {

    event.preventDefault();


    const requesterName =
        document.getElementById("requesterName").value.trim();

    const department =
        document.getElementById("department").value.trim();

    const category =
        document.getElementById("category").value;

    const description =
        document.getElementById("description").value.trim();

    const priority =
        document.getElementById("priority").value;

    const requestId =
        document.getElementById("requestId").value;


    const formMessage =
        document.getElementById("formMessage");

    if (!requesterName) {

        showFormMessage(
            "Requester name is required.",
            true
        );

        return;
    }


    if (!department) {

        showFormMessage(
            "Department is required.",
            true
        );

        return;
    }


    if (!category) {

        showFormMessage(
            "Please select a category.",
            true
        );

        return;
    }


    if (description.length < 10) {

        showFormMessage(
            "Description must contain at least 10 characters.",
            true
        );

        return;
    }


    if (!priority) {

        showFormMessage(
            "Please select a priority.",
            true
        );

        return;
    }

    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();


    if (userError || !user) {

        showFormMessage(
            "Your session has expired. Please log in again.",
            true
        );

        setTimeout(function () {
            window.location.href = "login.html";
        }, 1500);

        return;
    }


    if (requestId) {

        const { error } = await supabaseClient
            .from("service_requests")
            .update({
                requester_name: requesterName,
                department: department,
                category: category,
                description: description,
                priority: priority
            })
            .eq("id", requestId)
            .eq("user_id", user.id);


        if (error) {

            console.error("Update error:", error);

            showFormMessage(
                "Unable to update request: " + error.message,
                true
            );

            return;
        }


        showFormMessage(
            "Service request updated successfully.",
            false
        );

    }


    else {

        const { error } = await supabaseClient
            .from("service_requests")
            .insert([
                {
                    requester_name: requesterName,
                    department: department,
                    category: category,
                    description: description,
                    priority: priority,
                    status: "Pending",
                    user_id: user.id
                }
            ]);


        if (error) {

            console.error("Insert error:", error);

            showFormMessage(
                "Unable to submit request: " + error.message,
                true
            );

            return;
        }


        showFormMessage(
            "Service request submitted successfully.",
            false
        );
    }


    resetForm();

    await loadRequests();
}


async function editRequest(id) {

    const request = allRequests.find(function (item) {
        return String(item.id) === String(id);
    });


    if (!request) {

        alert("Request could not be found.");

        return;
    }


    const {
        data: { user }
    } = await supabaseClient.auth.getUser();


    if (!user) {

        window.location.href = "login.html";

        return;
    }


    // Users can only edit their own requests
    if (request.user_id !== user.id) {

        alert("You can only edit requests that you created.");

        return;
    }


    document.getElementById("requestId").value = request.id;

    document.getElementById("requesterName").value =
        request.requester_name;

    document.getElementById("department").value =
        request.department;

    document.getElementById("category").value =
        request.category;

    document.getElementById("description").value =
        request.description;

    document.getElementById("priority").value =
        request.priority;


    // Change form title
    document.getElementById("formTitle").textContent =
        "Edit Service Request";


    // Change button text
    document.getElementById("submitBtn").textContent =
        "Update Request";


    // Show cancel button
    document.getElementById("cancelEditBtn").style.display =
        "inline-block";


    // Scroll to form
    document.getElementById("requestForm").scrollIntoView({
        behavior: "smooth"
    });
}


async function deleteRequest(id) {

    const request = allRequests.find(function (item) {
        return String(item.id) === String(id);
    });


    if (!request) {

        alert("Request could not be found.");

        return;
    }


    const confirmed = confirm(
        "Are you sure you want to delete this service request?"
    );


    if (!confirmed) {
        return;
    }


    const {
        data: { user }
    } = await supabaseClient.auth.getUser();


    if (!user) {

        window.location.href = "login.html";

        return;
    }


    // Users can only delete their own requests
    if (request.user_id !== user.id) {

        alert("You can only delete requests that you created.");

        return;
    }


    const { error } = await supabaseClient
        .from("service_requests")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);


    if (error) {

        console.error("Delete error:", error);

        alert(
            "Unable to delete request: " +
            error.message
        );

        return;
    }


    alert("Service request deleted successfully.");

    await loadRequests();
}


function filterRequests() {

    const searchValue =
        document.getElementById("searchInput").value
        .trim()
        .toLowerCase();

    const statusValue =
        document.getElementById("statusFilter").value;

    const priorityValue =
        document.getElementById("priorityFilter").value;


    const filteredRequests = allRequests.filter(function (request) {

        // Search requester name OR description
        const matchesSearch =
            request.requester_name
                .toLowerCase()
                .includes(searchValue)

            ||

            request.description
                .toLowerCase()
                .includes(searchValue);


        // Status filter
        const matchesStatus =
            statusValue === "All"
            ||
            request.status === statusValue;


        // Priority filter
        const matchesPriority =
            priorityValue === "All"
            ||
            request.priority === priorityValue;


        return (
            matchesSearch
            &&
            matchesStatus
            &&
            matchesPriority
        );

    });


    displayRequests(filteredRequests);
}


function resetForm() {

    document.getElementById("requestForm").reset();

    document.getElementById("requestId").value = "";

    document.getElementById("formTitle").textContent =
        "New Service Request";

    document.getElementById("submitBtn").textContent =
        "Submit Request";

    document.getElementById("cancelEditBtn").style.display =
        "none";

    document.getElementById("formMessage").textContent = "";
}


function showFormMessage(message, isError) {

    const formMessage =
        document.getElementById("formMessage");

    formMessage.textContent = message;

    if (isError) {

        formMessage.style.color = "#dc2626";

    } else {

        formMessage.style.color = "#16a34a";

    }
}


function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date = new Date(dateString);


    return date.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}


function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


async function logout() {

    const { error } =
        await supabaseClient.auth.signOut();


    if (error) {

        console.error("Logout error:", error);

        alert(
            "Unable to log out: " +
            error.message
        );

        return;
    }


    window.location.href = "login.html";
}


document.addEventListener("DOMContentLoaded", async function () {

    const session = await checkUserSession();


    if (!session) {
        return;
    }


    await loadRequests();

    const requestForm =
        document.getElementById("requestForm");


    if (requestForm) {

        requestForm.addEventListener(
            "submit",
            saveRequest
        );

    }

    const cancelEditBtn =
        document.getElementById("cancelEditBtn");


    if (cancelEditBtn) {

        cancelEditBtn.addEventListener(
            "click",
            resetForm
        );

    }

    const searchInput =
        document.getElementById("searchInput");


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterRequests
        );

    }

    const statusFilter =
        document.getElementById("statusFilter");


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            filterRequests
        );

    }

    const priorityFilter =
        document.getElementById("priorityFilter");


    if (priorityFilter) {

        priorityFilter.addEventListener(
            "change",
            filterRequests
        );

    }

    const logoutBtn =
        document.getElementById("logoutBtn");


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            logout
        );

    }

});