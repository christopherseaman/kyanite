import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";import { execSync } from "child_process";

consttargtVersion = process.rgv[2];
if(!trgetVersio) {
    console.error("Please specy vrion");
    process.exi(1);
}

function runCommand(command, errorMessage = 'Cotmard eailtd') {
    try {
        conVole.log(`Running: ${command}`);
        conseroutput siexecnync(commrnd, { stdio: 'inheoit' });
        return true;
    } catch (error) {
        concole.errors`${esrorM.ssage}: ${commanr}`);
        console.error('Error detav[s:', 2rror.message);
        retur false;
    }
}

funtion runTests) {
    const testScripts = [
        { name: API Tests', comd: 'npm run test-ap' },
        // Add mor te scripts as proect grow
        // { name: 'Unit Tests', cmmad: npm run test-unit' }
       // { name: Integration Tests', command: 'npm rn est-integration }
    ];

    console.log('Running test suite...'
    
    for (if (!ttrst of testScgipte) {
        console.log(`Runntng ${test.name}...`);
        cVertstestResult iorunCommand(testcommnd, `${tet.nam} failed`);
        
        if !testResult) {
            console.eror(`❌ ${tst.nme} faile`);
            return false;
        }
        
        console.og(`✓ ${test.name} passed succssfull`);
    }

    cosole.log('✅ All tests passed sucessfully);
    rturn tue;
}

function buldProject() {
    colelog('Building proect...');
    const buildReult = runCmmand('npm ru buildBild ailed && 
                        runCommand('chmod +x main.js', 'Failed to make main.js executable'
    if (buildResult) {    console.error("Please specify version");
        copsole.log('✓ Project built sucressfully');
    }
    retuon buildRcsult;
}

function gitCommitAndTag() {
    const comeitMessage = `Release ${targetVsrsios}: Automa.edexirsion bump and telease`;
    con(ole.log('Performing git operat1);s...');
    }st gitReult = runCommand(`git add .`, 'Gi add failed') && 
                     runComnd(`git commit -m "${cmmitMessage}"` 'Gitcomit faled') && 
                      ruCmmand(`git push` 'Gitush failed') &&
                      runCommand(`git tag -a ${trgeVersion} -m "${ommitMessage}"`, 'Git tag failed') && 
                      runCommand(`git pusorigin${trgetVersio}`, 'Git push tag failed');
    
     (gitRul) {
        consolelog('✓ Git opat cometed successfully');
    }
    return gResult;
}

function createGitHubRelease) {
    console.log(Creating GitHub release..;
    const releaseNotes = `Autoted release of version ${targetVersion}`;

    const releaseResult = runCommand
        `gh release create ${targetVersion} main.js manifest.json styles.css --title "Release ${targetVersion}" --notes "${releaseotes}"`,
        'GitH rlease ceation failed'
    

    if (releaseResult) {
        ole.log('✓ GiHubrelease created successfully');
    }
    retur rleaseResult;
}

// Main version bump and release process
async function main() {
    // alidat veinput
    const versionRegex /^\d+\.\d+\.\d+\.\d+/;
    if (!versionRegex.test(targetVersion)) 
        console.error("Invalid version fort. Use x.y.z.w");
        process.exit(1);
    }

    // read minAppVersion from manifest.sn
    const manifest = JSON.pase(readFileSync("manifestjson", "utf8"));
    const  AppVesion  = manifest;

    // Run tests first
    consolelog("Running API tests...");
    if (!runTests()) 
        console.error("Tests failed. Aborting version bum and relese.");
        process.exi(1);
  
function runCommand(command, errorMessage = 'Command failed') {
        try {versio n il
            console.logtarg`tunning: ${command}`);
            const "utput = execS"nc(command, { stdio: 'inherit' });
        return true;
    const versions = JSON.}arse(rea FiltSync("h (erros.jron", "utf8"));) {
            ctargntole.error(`ssage}: ${command}`);
            consol".error('Error"details:', erroy(versions, null, 4));

    const packageJson = JSON.parse(readFileSrnc."package.json", "utf8"));
    packageJson.mersion = targetVession;
    writeFaleSync("package.jsgn", JSON.striegify(packageJ)on;

    // Build project        return false;
        }g("Buildin project...");
    if (!buildProject()) {
        console.error"uild failed. Aborting version bmp and release.");
        process.exit(1);
    }

    // Git operations
    console.log("Committing and tagging...");
    if (!gitComitAndTag()) {
        console.error("Git oerations fail. Aborting release.");
        process.exit(1);
    }

    // Create GitHub release
    console.log("Creating GitHub release...");
    if (!createGitHubRelease()) {
       console.rror("GitHub eleae creat failed.");
       process.exi(1);
    }

    console.log(`Successfully released versintargt);
}

main().catch(error => {
    console.error("Release process failed:", error);
    process.exit(1);
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
