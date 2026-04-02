const fs = require('fs');
const path = require('path');

function readFileSyncSafe(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf-8');
        }
    } catch (e) {}
    return null;
}

function parseGitAgentRepo(repoPath) {
    if (!fs.existsSync(repoPath)) {
        console.error(JSON.stringify({ error: "Path does not exist: " + repoPath }));
        process.exit(1);
    }

    const report = {
        agentManifest: readFileSyncSafe(path.join(repoPath, 'agent.yaml')),
        soul: readFileSyncSafe(path.join(repoPath, 'SOUL.md')),
        rules: readFileSyncSafe(path.join(repoPath, 'RULES.md')),
        skills: {}
    };

    const skillsDir = path.join(repoPath, 'skills');
    if (fs.existsSync(skillsDir)) {
        const skillFolders = fs.readdirSync(skillsDir);
        for (const folder of skillFolders) {
            const skillPath = path.join(skillsDir, folder, 'SKILL.md');
            if (fs.existsSync(skillPath)) {
                report.skills[folder] = readFileSyncSafe(skillPath);
            }
        }
    }

    console.log(JSON.stringify(report, null, 2));
}

const targetPath = process.argv[2];
if (!targetPath) {
    console.error(JSON.stringify({ error: "Missing repo path argument." }));
    process.exit(1);
}

parseGitAgentRepo(targetPath);
