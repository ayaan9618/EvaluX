const { simpleGit } = require("simple-git");
const path = require('path');
const fs = require("fs");
const { execSync } = require("child_process");
const { promisify } = require("util");
const { Project, SemgrepResult } = require("../models/Project");
const { TESTED_STATUS } = require("../db/enums");

function summarizeFindings(result) {
    return {
        issues: result.results.length,
        severityBreakdown: result.results.reduce((acc, item) => {
            const severity = item.extra?.severity || 'info';
            acc[severity] = (acc[severity] || 0) + 1;
            return acc;
        }, {})
    };
}

const runProjectAnalyzer = async (repoUrl, projectId) => {

    console.log("running project analyser")
    const safeLocalPath = path.join(__dirname, "../", "temp", Date.now().toString());
    await simpleGit().clone(repoUrl, safeLocalPath);
    console.log("project cloned")

    try {

        const stdout = execSync(
            `semgrep --config=auto --json`, {
                cwd: safeLocalPath,
                stdio: "pipe",
                encoding: "utf-8",
            }
        );

        const semgrepResults = JSON.parse(stdout);
        console.log("semgrep scan finished");

        await SemgrepResult.create({
            projectId: projectId,
            summary: summarizeFindings(semgrepResults),
            fullOutput: semgrepResults
        });

        await Project.findByIdAndUpdate(projectId,
            { tested: TESTED_STATUS.TESTED },
            { runValidators: true }
        );
    }
    catch (error) {

        fs.rmdirSync(safeLocalPath, { recursive: true, force: true });
        throw error;
    }
    fs.rmSync(safeLocalPath, { recursive: true, force: true });

}

module.exports = runProjectAnalyzer;
