# BRAT Installation Guide

## Creating a New Version

1. Version Numbering:
   - Use semantic versioning that matches implementation phase
   - Format: `[phase].[step].[substep].[iteration]`
   - Example: `0.1.2.1` = Phase 1, Step 2, Iteration 1

2. Automated Release Process:
   ```bash
   # Automatically runs tests, builds, commits, tags, and releases
   node version-bump.mjs [new-version]
   ```
   Automated steps:
   - Run API tests
   - Update version in:
     * manifest.json
     * versions.json
     * package.json
   - Build project
   - Make main.js executable
   - Git commit and push
   - Create GitHub release

## Release Validation Checks
1. Version Format
   - Must be `x.y.z.w`
   - Example: `0.1.2.10`

2. Automated Testing
   - Runs `npm run test-api`
   - Validates:
     * API connection
     * Key validation scenarios
     * Logging mechanisms

3. Build Verification
   - Builds project
   - Ensures main.js is executable
   - Checks for build errors

4. Git and Release Checks
   - Commits all changes
   - Creates git tag
   - Pushes to GitHub
   - Creates GitHub release with:
     * main.js
     * manifest.json
     * styles.css

## Troubleshooting
- Ensure .env file has valid API key
- Check GitHub CLI is installed and authenticated
- Verify all dependencies are installed
- Review console output for specific error messages

## Manual Intervention
If automated process fails:
1. Review console error messages
2. Fix specific issues
3. Manually complete steps not completed
4. Retry version bump script

## Best Practices
- Always test in a clean environment
- Ensure GitHub CLI is up to date
- Keep .env file secure and not committed
- Validate API key before running release
