const showMsg = getShowMsg(document.getElementById("infoErrorMsg"));
const form = document.getElementById("signupOrgForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();
    showMsg("Loading...", INFO_LIGHT);

    const orgName = form["org-name"].value;
    const contactEmail = form["contact-email"].value;
    const phone = form.phone.value;
    const websiteURL = form.website.value;
    const bio = form.description.value;

    const token = localStorage.getItem("token");

    try {
        const { data } = await axios.patch("/api/auth/register/complete",
            { orgName, contactEmail, phone, websiteURL, bio },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        localStorage.setItem("token", data.token);
        showMsg(data.msg, SUCCESS);
        window.location.href = "./org_dashboard.html";
        // if (userType === "org") {
        // } else if (userType === "reviewer") {
        //     window.location.href = "./reviewer_dashboard.html";
        // }

    } catch (error) {
        if (error.response?.data?.msg)
            showMsg(error.response.data.msg, ERROR);
        else console.error(error);
    }

});
