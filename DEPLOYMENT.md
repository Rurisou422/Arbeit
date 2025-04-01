# Deployment Guide for ArbeitDC

This guide will help you deploy this project to GitHub and Netlify.

## Deploying to GitHub

1. Create a new repository on GitHub
2. Configure your local git repository (if not already done):
   ```bash
   git init
   git config user.email "your.email@example.com"
   git config user.name "Your Name"
   ```

3. Add all files to git:
   ```bash
   git add .
   ```

4. Commit the changes:
   ```bash
   git commit -m "Initial commit with Netlify deployment setup"
   ```

5. Connect to your GitHub repository:
   ```bash
   git remote add origin https://github.com/YourUsername/Arbeit.git
   ```

6. Push to GitHub:
   ```bash
   git push -u origin main
   ```

## Deploying to Netlify

1. Sign up for a Netlify account if you don't have one
2. Go to the Netlify dashboard and click "New site from Git"
3. Select GitHub as your Git provider
4. Authorize Netlify to access your GitHub repositories
5. Select your repository
6. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
7. Click "Deploy site"

## Setting Environment Variables

After deploying, you need to set up your environment variables:

1. Go to your site dashboard on Netlify
2. Navigate to Site settings > Build & deploy > Environment
3. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Your MongoDB connection URL
   - `JWT_SECRET`: Your JWT secret key

## Updating Configuration

Before deploying, make sure to:

1. Update the `.env.production` file with your actual MongoDB URI and JWT secret
2. Don't commit this file to Git (it should be in your `.gitignore` file)
3. Set the correct values in Netlify environment variables instead

## Testing Locally

To test the Netlify functions locally:

1. Install the Netlify CLI if you haven't already:
   ```bash
   npm install -g netlify-cli
   ```

2. Run the local development server:
   ```bash
   netlify dev
   ```

This will start a local server that simulates the Netlify environment, including the serverless functions.

## Updating Your Site

After making changes:

1. Commit and push your changes to GitHub
2. Netlify will automatically deploy your updates

## Troubleshooting

If you encounter issues:

1. Check the Netlify build logs
2. Ensure your MongoDB connection is properly configured
3. Verify your environment variables are correctly set
4. Check for CORS issues if your API calls are failing 