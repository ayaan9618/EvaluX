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
        // window.location.href = "./otp.html";

    } catch (error) {
        if (error.response?.data?.msg)
            showMsg(error.response.data.msg, ERROR);
        else console.error(error);
    }

});
