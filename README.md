Finance CLI
A command-line tool to track personal finances, built with TypeScript, Prisma, and Neon Postgres. Manage expenses, income, and budgets with detailed reports, ASCII charts for spending visualization, and multi-month summaries.
Features

Add income and expense transactions with categories and descriptions.
View monthly or multi-month financial summaries (income, expenses, balance).
Export transactions to CSV for external analysis.
Analyze spending by category with optional ASCII charts.
Set and check monthly budgets with remaining balance alerts.
List recent transactions with customizable limits.
Delete transactions by ID with robust error handling.
Production-ready with retry logic for database operations, unit tests, linting, and CI/CD via GitHub Actions.

Installation
Install globally via NPM:
npm install -g @movineo/finance-cli

Or clone and run locally:
git clone https://github.com/Movineo/finance-cli.git
cd finance-cli
npm install
npm run build

Prerequisites

Node.js: v18 or later.
Neon Postgres: A free account with a database (set DATABASE_URL in .env).
Git: For cloning the repository (optional).

Setup

Clone the Repository (for local development):
git clone https://github.com/Movineo/finance-cli.git
cd finance-cli


Install Dependencies:
npm install


Set Up the Database:

Create a Neon Postgres database at console.neon.tech.
Copy the connection string (pooled, with sslmode=require).
Create a .env file in the project root:DATABASE_URL="postgresql://user:password@ep-project-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"


Run migrations and generate the Prisma client:npx prisma migrate dev --name init --schema=src/prisma/schema.prisma
npx prisma generate --schema=src/prisma/schema.prisma




Build the Project:
npm run build


Run the CLI:

Locally:node dist/index.js --help


Globally (after npm link or global installation):finance --help





Usage
finance <command> [options]

Commands

add: Add a new transaction.
finance add --type expense --amount 50 --category food --description "Lunch"

Options: --type <expense|income>, --amount <number>, --category <string>, --description <string>

summary: View financial summary for the current month or multiple months.
finance summary
finance summary --months 3

Options: --months <number> (default: 1)

export: Export transactions to CSV.
finance export --file transactions.csv

Options: --file <path>

breakdown: View spending by category with an optional ASCII chart.
finance breakdown
finance breakdown --no-chart

Options: --no-chart (disables ASCII chart)

set-budget: Set a monthly budget.
finance set-budget --amount 1000

Options: --amount <number>

check-budget: Check spending against the monthly budget.
finance check-budget


list: List recent transactions.
finance list --limit 10

Options: --limit <number> (default: 10)

delete: Delete a transaction by ID.
finance delete --id 1

Options: --id <number>


Run finance <command> --help for detailed options.
Example Workflow
# Set a budget
finance set-budget --amount 1500

# Add transactions
finance add --type income --amount 1000 --category salary --description "Freelance"
finance add --type expense --amount 300 --category utilities --description "Electricity"
finance add --type expense --amount 200 --category food --description "Groceries"

# View reports
finance list
finance breakdown
finance summary
finance check-budget

# Export data
finance export --file transactions.csv

# Delete a transaction
finance delete --id 1

Development
Scripts

Build: Compile TypeScript to JavaScript.npm run build


Test: Run Jest unit tests.npm test


Lint: Check code quality with ESLint.npm run lint


Development Mode: Run with ts-node for quick testing.npm run dev add --type expense --amount 50


Prisma Commands:npm run prisma:migrate
npm run prisma:generate



Testing
The CLI includes unit tests for add, delete, summary, check-budget, and breakdown commands using Jest. Run:
npm test

CI/CD
The project uses GitHub Actions for continuous integration and deployment. The workflow (ci.yml) runs on push/pull requests to the main branch, performing:

Unit tests with Jest.
Linting with ESLint.
Building the project and generating the Prisma client.

To enable CI/CD:

Push to a GitHub repository (e.g., github.com/Movineo/finance-cli).
Add DATABASE_URL to GitHub Secrets (Settings → Secrets and variables → Actions).
Monitor runs at https://github.com/Movineo/finance-cli/actions.

Troubleshooting

Database Connection Issues:
Verify DATABASE_URL in .env matches your Neon Postgres connection string.
Check Neon’s status: status.neon.tech.
Test connectivity:npx prisma db pull --schema=src/prisma/schema.prisma




Command Errors:
Ensure required options are provided (e.g., --type for add).
For delete, use finance list to find valid transaction IDs.
Invalid IDs return "Transaction with ID X not found".


ASCII Chart Issues:
If the chart doesn’t render correctly, try a different terminal (e.g., PowerShell, VS Code).
Use --no-chart to disable the chart.


Test Failures:
Run npm test -- --verbose for detailed output.
Ensure Prisma mocks are correctly set up in tests.



Contributing

Fork the repository: https://github.com/Movineo/finance-cli.
Create a feature branch: git checkout -b feature-name.
Commit changes: git commit -m "Add feature".
Push to the branch: git push origin feature-name.
Open a pull request.

License
MIT
Acknowledgments

Built with TypeScript, Prisma, Neon, Commander.js, and asciichart.
Inspired by personal finance management needs.

