# Pollyfort Deployment Configuration Guide

## Current Issue
The deployment is configured for static hosting but this is a full-stack Node.js/Express application that requires:
- Server-side processing (Express.js)
- Database connectivity (PostgreSQL)
- API endpoints
- Session management

## Required Configuration Changes

### 1. Deployment Type Change
The deployment target needs to be changed from `static` to `autoscale` in the `.replit` file:

```toml
[deployment]
deploymentTarget = "autoscale"  # Changed from "static"
build = ["npm", "run", "build"]
run = ["npm", "start"]          # Added for server execution
```

### 2. Build Process
The current build process creates:
- Frontend assets in `dist/public` (via Vite)
- Server bundle in `dist/index.js` (via esbuild)

For autoscale deployment, this structure is correct and no changes are needed.

### 3. Environment Variables
Ensure these environment variables are available in production:
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV=production`
- Any other application-specific secrets

## Current Workaround Applied

Since the deployment configuration files cannot be modified programmatically, I've implemented a temporary workaround:

1. Created `build.js` - Custom build script that properly structures files for deployment
2. Updated `build-deploy.sh` - Deployment script that uses the custom build process
3. Copied `index.html` to `dist/` directory to satisfy static deployment requirements

## Recommended Action

**Manual Configuration Required:**
Update the `.replit` file deployment section to use `autoscale` instead of `static` deployment target.

This change will:
- Enable proper Node.js server execution
- Allow database connections
- Support API endpoints
- Enable session management

The application will then deploy correctly as a full-stack web application.