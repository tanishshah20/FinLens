# Finance Dashboard UI

A clean, interactive, and modern financial dashboard built with React and Vite. This project simulates a user tracking their financial activity with beautiful data visualizations, role-based access control, and actionable insights.

## Features

*   **Dashboard Overview**: View your net balance, total income, expenses, and savings rate at a glance. Includes an area chart for balance trends and a pie chart for spending breakdown.
*   **Transactions Management**: Explore a detailed list of transactions.
    *   **Filtering**: Search by description, or filter by category and transaction type.
    *   **Sorting**: Sort transactions chronologically or by amount.
*   **Basic Role-Based UI (RBAC)**: Switch between `Viewer` and `Admin` roles.
    *   `Viewer`: Read-only access to all data and charts.
    *   `Admin`: Can add new transactions and delete existing ones.
*   **Insights Section**: AI-powered financial analysis showing your top spending category, month-over-month comparisons, average breakdowns, and a dynamic financial health score.
*   **Responsive Design**: A sleek, fully responsive dark-themed UI that adapts to mobile screens with a bottom navigation bar.

## Tech Stack

*   **Framework**: React (Bootstrapped with Vite)
*   **State Management**: Zustand (for clean, robust global state handling)
*   **Data Visualization**: Recharts (for Area and Pie charts)
*   **Styling**: Plain CSS with modular inline styles, ensuring zero dependency on massive UI libraries while maintaining a stunning glassmorphism aesthetic.
*   **Icons**: Native emojis for lightweight and fast rendering.

## Setup Instructions

1.  **Clone the repository** (or download the source code).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
    *(Ensure you have Node.js installed on your system)*
3.  **Run the development server**:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173` in your browser to view the application.

## Overview of Approach

*   **State Management**: **Zustand** is utilized as the central global store (`useFinanceStore`) to handle the application's core data (transactions, filters, selected tabs, roles, and form inputs). React's `useMemo` is heavily leveraged on top of this global state to derive summary statistics, dynamically filter data, and sort records efficiently without unnecessary recalculations.
*   **Component Structure**: The main UI resides in `App.jsx`, pulling state directly from the isolated Zustand store to keep rendering logic clean and strictly separated from business logic.
*   **Design Philosophy**: Focus on a premium "Dark Mode" aesthetic using subtle gradients, blur filters (backdrop-filter), and carefully selected color palettes to ensure high readability and a modern feel.

## Optional Enhancements Included

*   **Dark Mode**: Native, permanent dark theme with curated financial-friendly colors.
*   **Animations**: Smooth fade-up transitions on page loads and hover micro-interactions on cards and buttons.
*   **Empty States**: Graceful handling when no transactions match the active filters.
