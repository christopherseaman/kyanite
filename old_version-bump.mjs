import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

const targetVersion = process.argv[2];
if (!targetVersion) {
    console.error("Please specify version");
    process.exit(1);
}

function runCommand(command, errorMessage = 'Command failed') {
    try {
        console.log(`Running: ${command}`);
        const output = execSync(command, { stdio: 'inherit' });
        return true;
    } catch (error) {
        console.error(`${errorMessage}: ${command}`);
        console.error('Error details:', error.message);
        return false;
    }
}

function runTests() {
    const testScripts = [
        { name: 'API Tests', command: 'npm run test-api' },
        // Add more test scripts as project grows
        // { name: 'Unit Tests', command: 'npm run test-unit' },
        // { name: 'Integration Tests', command: 'npm run test-integration' }
    ];

    console.log('Running test suite...');
    
    for (const test of testScripts) {
        console.log(`Running ${test.name}...`);
        const testResult = runCommand(test.command, `${test.name} failed`);
        
        if (!testResult) {
            console.error(`❌ ${test.name} failed`);
            return false;
        }
        
        console.log(`✓ ${test.name} passed successfully`);
    }

    console.log('✅ All tests passed successfully');
    return true;
}

function buildProject() {
    console.log('Building project...');
    const buildResult = runCommand('npm run build', 'Build failed') && 
                        runCommand('chmod +x main.js', 'Failed to make main.js executable');
    if (buildResult) {
        console.log('✓ Project built successfully');
    }
    return buildResult;
}

function gitCommitAndTag() {
    const commitMessage = `Release ${targetVersion}: Automated version bump and release`;
    console.log('Performing git operations...');
    const gitResult = runCommand(`git add .`, 'Git add failed') && 
                      runCommand(`git commit -m "${commitMessage}"`, 'Git commit failed') && 
                      runCommand(`git push`, 'Git push failed') &&
                      runCommand(`git tag -a ${targetVersion} -m "${commitMessage}"`, 'Git tag failed') && 
                      runCommand(`git push origin ${targetVersion}`, 'Git push tag failed');
    
    if (gitResult) {
        console.log('✓ Git operations completed successfully');
    }
    return gitResult;
}

function createGitHubRelease() {
    console.log('Creating GitHub release...');
    const releaseNotes = `Automated release of version ${targetVersion}`;

    const releaseResult = runCommand(
        `gh release create ${targetVersion} main.js manifest.json styles.css --title "Release ${targetVersion}" --notes "${releaseNotes}"`,
        'GitHub release creation failed'
    );

    if (releaseResult) {
        console.log('✓ GitHub release created successfully');
    }
    return releaseResult;
}

// Main version bump and release process
async function main() {
    // Validate version input
    const versionRegex = /^\d+\.\d+\.\d+\.\d+$/;
    if (!versionRegex.test(targetVersion)) {
        console.error("Invalid version format. Use x.y.z.w");
        process.exit(1);
    }

    // read minAppVersion from manifest.json
    const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
    const { minAppVersion } = manifest;

    // Run tests first
    console.log("Running API tests...");
    if (!runTests()) {
        console.error("Tests failed. Aborting version bump and release.");
        process.exit(1);
    }

    // Update version in files
    manifest.version = targetVersion;
    writeFileSync("manifest.json", JSON.stringify(manifest, null, 4));

    const versions = JSON.parse(readFileSync("versions.json", "utf8"));
    versions[targetVersion] = minAppVersion;
    writeFileSync("versions.json", JSON.stringify(versions, null, 4));

    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
    packageJson.version = targetVersion;
    writeFileSync("package.json", JSON.stringify(packageJson, null, 4));

    // Build project
    console.log("Building project...");
    if (!buildProject()) {
        console.error("Build failed. Aborting version bump and release.");
        process.exit(1);
    }

    // Git operations
    console.log("Committing and tagging...");
    if (!gitCommitAndTag()) {
        console.error("Git operations failed. Aborting release.");
        process.exit(1);
    }

    // Create GitHub release
    console.log("Creating GitHub release...");
    if (!createGitHubRelease()) {
        console.error("GitHub release creation failed.");
        process.exit(1);
    }

    console.log(`Successfully released version ${targetVersion}`);
}

main().catch(error => {
    console.error("Release process failed:", error);
    process.exit(1);
});
