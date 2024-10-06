# Blog Platform - Monorepo for Authors and Readers

This project is a multi-frontend blog platform, where authors can create and manage blog posts, while readers can explore the published content. The application is split into two front-ends: one for the **authors** to manage their posts and another for the **readers** to browse through the blog content.

## Live Demo

- **Author Site**: [Author Frontend](https://author-front-end.vercel.app/)  
- **Reader Site**: [Reader Frontend](https://reader-front-end.vercel.app/)

## Features

### Author Frontend

- **TinyMCE Editor**: Beautify post content with a rich text editor.
- **Post Management**: Create, edit, and delete blog posts.
- **Draft and Publish**: Save posts as drafts or publish them immediately.
- **Responsive Design**: Optimized for various screen sizes.

### Reader Frontend

- **Explore Posts**: Browse through published blog posts.

## Technology Stack

- **Frontend**: React, Vite, TinyMCE, Tailwind CSS
- **Backend**: Express.js, PostgreSQL (via Prisma ORM)
- **Authentication**: Passport.js with JWT strategy
- **Deployment**: Vercel (Frontend), supabase (Database)
- **Version Control**: Git, GitHub


