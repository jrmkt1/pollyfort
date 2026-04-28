# Replit Deployment Configuration for Pollyfort

## Current Issue
The deployment is configured for static hosting, but this is a full-stack Node.js application requiring server-side functionality.

## Required Configuration Change

### Update .replit file
Change the deployment section in your `.replit` file from:

```toml
[deployment]
deploymentTarget = "static"
build = ["npm", "run", "build"]
publicDir = "dist"
```

To:

```toml
[deployment]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]
run = ["npm", "start"]
```

## Why This Change is Necessary

### Static Deployment (Current - Incorrect)
- Serves only static files (HTML, CSS, JS)
- No server-side processing
- Cannot connect to databases
- Cannot handle API requests

### Autoscale Deployment (Required - Correct)
- Runs Node.js server
- Supports database connections
- Handles API endpoints
- Manages user sessions
- Scales automatically based on traffic

## Application Architecture

### Frontend Components
- React with TypeScript
- Tailwind CSS styling
- Product catalog interface
- Quotation request forms
- User authentication

### Backend Components
- Express.js server
- PostgreSQL database integration
- Session management
- API endpoints for:
  - Product management
  - Customer authentication
  - Quotation processing

### Database Requirements
- PostgreSQL connection (DATABASE_URL)
- Session storage
- Product catalog
- Customer management
- Quotation tracking

## Deployment Steps

1. **Update Configuration**: Modify `.replit` file as shown above
2. **Build Application**: Run `npm run build`
3. **Deploy**: Use Replit's deploy button
4. **Verify Environment**: Ensure DATABASE_URL is set

## Environment Variables
The following environment variables are required:
- `DATABASE_URL`: PostgreSQL connection string (automatically provided by Replit)
- `NODE_ENV`: Set to "production" for deployment
- `PORT`: Automatically set by Replit deployment

## Build Process
The build creates:
- Frontend bundle in `dist/` directory
- Server bundle (`dist/index.js`)
- Production `package.json`
- All necessary static assets

## Troubleshooting

### If deployment still fails:
1. Verify `.replit` configuration matches exactly
2. Check that `npm run build` completes successfully
3. Ensure PostgreSQL is enabled in Replit project
4. Confirm all dependencies are listed in package.json

### Common Issues:
- **"Cannot find module"**: Missing dependencies in production package.json
- **"ECONNREFUSED"**: Database not properly configured
- **"Port already in use"**: Restart the Repl before deploying

## Support
This configuration supports the full Pollyfort application with all features:
- Product browsing and search
- Customer registration and login
- Quotation requests and management
- Admin panel functionality
- Real-time data updates