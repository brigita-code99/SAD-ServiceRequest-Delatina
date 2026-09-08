const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");


if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        message.textContent = "Logging in...";
        message.style.color = "#333";


        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });


        if (error) {

            message.textContent =
                "Login failed: " + error.message;

            message.style.color = "#dc2626";

            return;
        }


        message.textContent =
            "Login successful!";

        message.style.color = "#16a34a";


        window.location.href = "index.html";

    });

}


async function checkExistingLogin() {

    // Only perform this on the login page
    if (!loginForm) {
        return;
    }


    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    if (session) {

        window.location.href = "index.html";

    }

}


checkExistingLogin();