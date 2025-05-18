const defaultCard = document.getElementById("defaultCard");
const projectList = document.getElementById("projectList");

async function fillProjectDetails() {

    const token = localStorage.getItem("token");

    try {
        const { data } = await axios.get("/api/projects",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        projectList.innerHTML = "";
        data.projects.forEach(p => {

            const card = defaultCard.cloneNode(true);

            let status;
            let s_col;
            if (p.status === "authorized") {
                status = "Approved";
                s_col = "bg-green-400";
            }
            else if (p.status === "pending") {
                status = "Pending";
                s_col = "bg-yellow-400";
            }
            else if (p.status === "rejected") {
                status = "Rejected";
                s_col = "bg-red-400";
            }
            card.dataset.status = status;

            card.querySelector("#project_title").textContent = p.title;
            card.querySelector("#project_desc").textContent = p.description || "No description provided";
            card.querySelector("#tags").innerHTML = "";
            p.technologies.forEach(t => {
                const span = document.createElement("span");
                span.classList = "text-xs bg-cyan-600 px-2 py-0.5 rounded";
                span.textContent = "#" + t;
                card.querySelector("#tags").appendChild(span);

            });
            card.querySelector("#projectCreatedAt").textContent = "Submitted on:"+formatTimestamp(p.createdAt);
            card.querySelector("#project_view_btn").href = `Project_panel.html?id=${p._id}`;
            card.querySelector("#project_status").textContent = status;
            card.querySelector("#project_status").classList.add(s_col);

            card.hidden = false;
            card.classList.remove("hidden");
            card.classList.add("project");
            projectList.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        alert("Something went wrong in fetching your projects");
    }
}

async function fillReviewerDetails() {

    const token = localStorage.getItem("token");

    try {
        const { data } = await axios.get("/api/user",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        document.getElementById("u_name").textContent = data.user.fullName;
        document.getElementById("u_id").textContent = data.user._id;

        // document.getElementById("u_assign").textContent = data.user.;
        // document.getElementById("u_approve").textContent = data.user.;
        // document.getElementById("u_rej").textContent = data.user.;
        // document.getElementById("u_pending").textContent = data.user.;

    } catch (error) {
        console.error(error);
        alert("Something went wrong in fetching your details");
    }

}

fillReviewerDetails();
fillProjectDetails();
