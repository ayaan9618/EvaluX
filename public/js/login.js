const showMsg = getShowMsg(document.getElementById("infoErrorMsg"));
const form = document.getElementById("loginForm");
// const courseSellerBtn = document.getElementById("role-course-seller");
// const reviewerBtn = document.getElementById("role-reviewer");

form.addEventListener("submit", async (e) => {

    e.preventDefault();
    showMsg("Loading...", INFO_LIGHT);

    const userType = form.role.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
        const { data } = await axios.post("/api/auth/login",
            { userType, email, password }
        );

        localStorage.setItem("token", data.token);
        showMsg(data.msg, SUCCESS);

        // Redirect to the appropriate dashboard based on user type
        if (userType === "org") {
            window.location.href = "./org_dashboard.html";
        } else if (userType === "reviewer") {
            window.location.href = "./reviewer_dashboard.html";
        }
        // window.location.href = "./otp.html";

    } catch (error) {
        if (error.response?.data?.msg)
            showMsg(error.response.data.msg, ERROR);
        else console.error(error);
    }

});
