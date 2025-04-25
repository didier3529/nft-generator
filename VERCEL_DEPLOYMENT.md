# Deploying the NFT Generator to Vercel

This guide explains how to deploy the NFT Generator project to Vercel.

## Prerequisites

- A GitHub account with your project repository
- A Vercel account (you can sign up using your GitHub account)

## Deployment Steps

1. **Push your code to GitHub**
   Make sure all changes are committed and pushed to your GitHub repository.

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com) and sign in with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository containing your NFT Generator project

3. **Configure Project Settings**
   - Framework Preset: Select "Create React App"
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/build`
   - Root Directory: Keep as default (/)
   - Environment Variables: Add any required environment variables

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

## Troubleshooting Common Vercel Deployment Errors

### Application Error (HTTP 500)
- Check your application logs in the Vercel dashboard
- Look for build errors or runtime errors
- Verify that all environment variables are properly set

### Middleware Error (HTTP 500)
- This typically indicates an issue with Edge Function invocation
- Check your middleware configuration
- Verify API routes are properly defined

### Function Invocation Failed (HTTP 500)
- Check function logs in Vercel dashboard
- Verify that your serverless functions don't exceed memory or time limits
- Ensure dependencies are properly installed

### Function Timeout (HTTP 504)
- Your serverless function took too long to respond
- Optimize your function to respond faster
- Consider breaking up complex operations

### For More Information

If you need additional help, consult the [Vercel Documentation](https://vercel.com/docs) or open an issue in the project repository. 