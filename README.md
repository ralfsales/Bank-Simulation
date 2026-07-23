# Ledger : Banking System Demo

Ledger is a responsive banking system demonstration built with HTML, CSS, and JavaScript. It provides an interactive interface for managing bank branches, customer accounts, and financial transactions.

The project is based on my Java object oriented programming project involving `Bank`, `Branch`, and `Customer` classes. This web version presents the same concepts through a browser based interface.

## Features

- Create and manage bank branches
- Add customers to individual branches
- Assign an initial deposit when creating an account
- Record positive deposits
- Record negative withdrawals and payments
- Calculate customer and bank balances automatically
- View complete transaction histories
- Prevent duplicate branch and customer names
- Restore the original demonstration data
- Save changes locally using browser `localStorage`
- Responsive layout for desktop, tablet, and mobile devices

## Technologies

- HTML5
- CSS3
- JavaScript
- Java

No frameworks, external packages, backend, or build process are required.

## Project structure

```text
banking-system-web/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## Transactions

When recording a transaction:

- Enter a positive number to add money.
- Enter a negative number to represent a withdrawal or payment.
- A transaction of zero is not accepted.

For example:

```text
100.00   Deposit of €100.00
-25.50   Withdrawal or payment of €25.50
```

```text
https://your-username.github.io/your-repository/
```

## Data storage

The application stores demonstration data in the visitor's browser using `localStorage`. It does not connect to a server or process real banking information.

Clearing browser data will remove saved branches, customers, and transactions. The **Reset demo** button restores the original sample data.

## Purpose

This project demonstrates:

- Object-oriented data relationships
- JavaScript state management
- Form handling and validation
- Dynamic DOM rendering
- Financial transaction calculations
- Responsive interface design
- Local browser persistence

## Disclaimer

This application is a personal portfolio project. It is not intended to manage real accounts, payments, or sensitive financial information.
