Developer Assignment
Overview
Build a Product Catalog Application. This project aims to evaluate your proficiency with the technologies in our stack. It’s completely fine if you copy code from somewhere, or use GenAI. Having said that, keep in mind that you should be able to explain your code in the call that would follow the successful completion of this assignment.

Expected completion time: max 1-2 days
Tech Stack Requirements
The following must necessarily be used:
Next.js (with Typescript)
SASS
Redux Toolkit Query
Formik
Node.js
Docker
MSSQL/MySQL/MongoDB (pick any one)
Architecture
Frontend - Customer-facing product catalog
Backend API Service - REST API for data operations
Database Schema
Create a Product schema with:
title (string, required)
description (text, required)
image (image, required)
category (string or enum [Clothing, Shoes, Electronics, …], required)
price (number, required)
availability (boolean, required)
slug (slug, required)
Core Features
1. Product Listing Page (/)
Grid layout with product cards (image, title, price)
“Add Product” button which opens product form in a dialog/sheet having these fields
title
image
category
price
availability
slug - read-only and should be auto-generated from title
description
Search bar - searches product titles
Category filter - checkboxes
Price range filter - min/max inputs or slider
Sort by price - High to Low, Low to High

2. Product Detail Page (/products/[slug])
Full product details (image, title, description, category, price, availability)
Related Products - 3-4 items from same category
Add delete and update product button. (optional)
Submission Guidelines
Create a public git repository (use GitHub, GitLab, Bitbucket, etc)
Include a comprehensive README with:
Setup instructions
Provide a working demo URL with admin panel credential.
