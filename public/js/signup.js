const showMsg = getShowMsg(document.getElementById("infoErrorMsg"));
const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();
    showMsg("Loading...", INFO_LIGHT);

    const userType = form.role.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form["confirm-password"].value;

    if (password !== confirmPassword) {
        showMsg("Passwords don't match!", ERROR);
        return;
    }

    try {
        const { data } = await axios.post("/api/auth/register",
            { userType, email, password }
        );

        localStorage.setItem("token", data.token);
        showMsg(data.msg, SUCCESS);
        if (userType === "org") {
            window.location.href = "./org_signup.html";
        } else if (userType === "reviewer") {
            window.location.href = "./reviewer_signup.html";
        }

    } catch (error) {
        if (error.response?.data?.msg)
            showMsg(error.response.data.msg, ERROR);
        else console.error(error);
    }

});
