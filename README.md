# React E-commerce Shop

**react-ecommerceshops** is a frontend project developed with React, serving as the user interface for an e-commerce application. This project organizes its codebase across different folders to ensure scalability, modularity, and maintainability.

## Table of Contents
- [Project Structure](#project-structure)
- [Folder Breakdown](#folder-breakdown)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

The main folders in this project are:
- `component` - Contains all UI components.
- `service` - Includes files for API interaction and route guards.
- `style` - Holds CSS styles and the main application styles.

Below is a detailed breakdown of each folder and its contents.

## Folder Breakdown

### `component/`

This folder is organized into the following subfolders:

- **admin/**
  - Contains components specific to the admin dashboard:
    - `AddCategory.jsx` - Add new categories.
    - `AddProductPage.jsx` - Add new products.
    - `AdminCategoryPage.jsx` - Manage categories.
    - `AdminOrderDetailsPage.jsx` - View order details.
    - `AdminOrderPage.jsx` - View all orders.
    - `AdminPage.jsx` - Main admin dashboard.
    - `AdminProductPage.jsx` - Manage products.
    - `EditCategory.jsx` - Edit category details.
    - `EditProductPage.jsx` - Edit product details.

- **common/**
  - Shared components used across multiple pages:
    - `Footer.jsx` - Footer of the site.
    - `Navbar.jsx` - Navigation bar.
    - `Pagination.jsx` - Pagination for lists.
    - `ProductList.jsx` - Display a list of products.

- **context/**
  - Context API for managing global states:
    - `CartContext.js` - Manages the cart state and actions.

- **pages/**
  - Different pages in the application:
    - `AddressPage.jsx` - User address management.
    - `CartPage.jsx` - Shopping cart overview.
    - `CategoryListPage.jsx` - List of categories.
    - `CategoryProductsPage.jsx` - Products by category.
    - `Home.jsx` - Homepage with featured products.
    - `LoginPage.jsx` - Login form.
    - `ProductDetailsPage.jsx` - Product information.
    - `ProfilePage.jsx` - User profile.
    - `RegisterPage.jsx` - User registration form.

### `service/`

- **ApiService.js** - Manages all HTTP requests to the backend.
- **Guard.js** - Contains route guards for protected routes.

### `style/`

- **App.css** - Global styles for the application.
- Additional CSS files for styling components.

## Getting Started

To get started with this project:

1. Clone the repository:
   ```bash
   git clone https://github.com/RakeshJambula/react-ecommerceshops.git

2. Install dependencies:
   ```bash
    npm install

3. Run the development server:
   ```bash
   npm start

The application should now be running on http://localhost:3000.

## available-scripts

In the project directory, you can run:

• npm start - Runs the app in development mode.

• npm test - Launches the test runner.

• npm run build - Builds the app for production.

• npm run eject - Ejects the configuration (not reversible).

## dependencies

• React - Core library for building the UI.

• Axios - For making HTTP requests.

• React Router - For handling page routing.

• Context API - For managing global state (e.g., CartContext).

## contributing

Contributions are welcome! Please fork the repository and make a pull request with your changes. Ensure code quality by running linting and tests before submitting.

## license

This project is licensed under the MIT License. See the LICENSE file for details.

```bash
This README provides an organized structure and explains the purpose of each folder and file within your project, helping contributors and other developers understand its setup and functionality.
