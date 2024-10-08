# Social Media Manager - README

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)

---

## Introduction

Welcome to **Social Media Manager**, your all-in-one platform for managing social media accounts. This web application allows users to:
- View analytics from multiple social media platforms.
- Create and post content to all connected accounts with a single click.
- Easily track performance metrics, engagement, and trends across platforms.

Whether you're a business owner, social media manager, or influencer, this tool streamlines the process of managing your online presence.

---

## Features

- **Multi-Platform Posting:** Compose a post once and publish it to various social media platforms simultaneously.
- **Analytics Dashboard:** Access detailed analytics for platforms like Facebook, Instagram, Twitter, and more.
- **Cross-Platform Integration:** Seamless integration with major social networks for analytics and posting.
- **Mobile-Responsive Design:** Manage your social media from any device, on the go.

---

## Tech Stack

- **Frontend:**
  - Next.js (React)
  - TypeScript
  - Tailwind CSS

- **Backend:**
  - Node.js
  - Express
  - MongoDB (via Mongoose)

- **Authentication:**
  - NextAuth (OAuth + Credentials)
  
- **APIs:**
  - Social Media APIs (Facebook, Instagram, Twitter, etc.)

---

## Installation

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js (v16+)
- MongoDB (or access to a MongoDB Atlas cluster)

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/social-media-manager.git
   cd social-media-manager

2. **Install Dependencies:**
   ```bash
   npm install


3. **Set up environment variables:**

   Create a `.env.local` file in the root of the project with the following content:

   ```env
   MONGODB_URI=<your-mongodb-uri>
   NODE_ENV=<development|production>
  AUTH_SECRET=<your-auth-secret>
  GITHUB_CLIENT_ID=<your-github-client-id>
  GITHUB_CLIENT_SECRET=<your-github-client-secret>
  GOOGLE_CLIENT_ID=<your-google-client-id>
  GOOGLE_CLIENT_SECRET=<your-google-client-secret>
  LINKEDIN_CLIENT_ID=<your-linkedin-client-id>
  LINKEDIN_CLIENT_SECRET=<your-linkedin-client-secret>
  LINKEDIN_REDIRECT_URI=<your-linkedin-redirect-uri>
  TIKTOK_CLIENT_ID=<your-tiktok-client-id>
  TIKTOK_CLIENT_SECRET=<your-tiktok-client-secret>
  TIKTOK_REDIRECT_URI=<your-tiktok-redirect-uri>
  TWITTER_CLIENT_ID=<your-twitter-client-id>
  TWITTER_CLIENT_SECRET=<your-twitter-client-secret>
  TWITTER_API_KEY=<your-twitter-api-key>
  TWITTER_API_SECRET_KEY=<your-twitter-api-secret-key>
  TWITTER_BEARER_TOKEN=<your-twitter-bearer-token>
  TWITTER_REDIRECT_URI=<your-twitter-redirect-uri>
  EMAIL_PASS=<your-email-app-password>
  EMAIL_USER=<your-email-address>
  DOMAIN_URL=<your-domain-url>




4. **Run the Development Server:**
   ```bash
   npm run dev

The application will be available at http://localhost:3000.

## Configuration

The application uses several third-party APIs for posting and analytics. You'll need to create developer accounts and generate API keys for each platform.

- **Facebook & Instagram API:**
  - Follow the steps at [Facebook for Developers](https://developers.facebook.com/) to create an app and retrieve the `CLIENT_ID` and `CLIENT_SECRET`.

- **Twitter API:**
  - Go to [Twitter Developer](https://developer.twitter.com/en/apps) to register an app and get your API credentials.

---

## Usage

- **Connect Accounts:** Link your social media accounts in the account settings page.
- **Create a Post:** Draft a message, select platforms, and click "Publish."
- **View Analytics:** Check engagement metrics and performance in the "Analytics" tab.

