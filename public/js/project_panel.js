const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

function extractOwnerRepo(url) {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    return match ? { owner: match[1], repo: match[2] } : null;
}

let project;
let projectAssessment;

async function getProject() {

    try {

        const { data } = await axios.get("/api/projects/" + projectId);
        project = data.project;
        projectAssessment = data.assessment;

        document.getElementById("p_title").textContent = project.title;
        document.getElementById("p_github").href = project.gitHubRepoURL;

        const { owner, repo } = extractOwnerRepo(project.gitHubRepoURL);
        document.getElementById("githhubCodespaceBtn").onclick = () => {
            const codespaceUrl = `https://github.com/codespaces/new?repo=${owner}%2F${repo}`;
            window.open(codespaceUrl, "_blank");
        }
        getGithubFolderTree(owner, repo).then((string) => {
            document.getElementById("p_dir_struct").textContent = string;
        });
        document.getElementById("testResults").textContent = JSON.stringify(data.assessment.summary);


    } catch (error) {
        console.error(error);
        alert(`Project with id: ${projectId} not found`);
    }

}

getProject();

async function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
}

async function getGithubFolderTree(owner, repo, branch = "main") {

    let res;
    try {
        res = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
            {
                headers: {
                    // "User-Agent": "axios-client",
                    Accept: "application/vnd.github+json"
                }
            }
        );
    } catch (error) {
        console.error('Error fetching or formatting repo tree:', error.message);
        return '';
    }

    const paths = res.data.tree.map(obj => obj.path);

    const buildTree = (paths) => {
        const root = {};
        for (const path of paths) {
            const parts = path.split('/');
            let current = root;
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const isFile = i === parts.length - 1 && !path.endsWith('/');
                if (!current[part]) current[part] = isFile ? null : {};
                if (!isFile) current = current[part];
            }
        }
        return root;
    };

    const formatTree = (tree, prefix = '') => {
        const entries = Object.entries(tree);
        const lastIndex = entries.length - 1;
        return entries
            .map(([name, value], index) => {
                const isLast = index === lastIndex;
                const connector = isLast ? '└─ ' : '├─ ';
                const indent = isLast ? '   ' : '│  ';
                if (value === null) {
                    return prefix + connector + name;
                } else {
                    return (
                        prefix + connector + name + '/' + '\n' + formatTree(value, prefix + indent)
                    );
                }
            })
            .join('\n');
    };

    const tree = buildTree(paths);
    return formatTree(tree);

}