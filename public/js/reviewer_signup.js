const showMsg = getShowMsg(document.getElementById("infoErrorMsg"));
const form = document.getElementById("signupRevForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();
    showMsg("Loading...", INFO_LIGHT);

    const fullName = form["full-name"].value;
    const contactEmail = form.email.value;
    const linkedlnURL = form.linkedin.value;
    const bio = form.experience.value;
    const skills = tags;

    const token = localStorage.getItem("token");

    try {
        const { data } = await axios.patch("/api/auth/register/complete",
            { fullName, contactEmail, linkedlnURL, bio, skills },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        localStorage.setItem("token", data.token);
        showMsg(data.msg, SUCCESS);
        window.location.href = "./reviewer_dashboard.html";

    } catch (error) {
        if (error.response?.data?.msg)
            showMsg(error.response.data.msg, ERROR);
        else console.error(error);
    }

});
