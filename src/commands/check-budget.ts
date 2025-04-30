import { Command } from 'commander';
import chalk from 'chalk';
import prisma from '../db/prisma';

const checkBudget = new Command('check-budget')
  .description('Check spending against the monthly budget')
  .action(async () => {
    try {
      const currentDate = new Date();
      const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const budget = await prisma.budget.findUnique({ where: { month: monthKey } });
      const expenses = await prisma.transaction.aggregate({
        where: {
          type: 'expense',
          date: {
            gte: startOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      });
      const totalExpenses = expenses._sum.amount || 0;
      if (!budget) {
        console.log(chalk.yellow('No budget set for this month.'));
        console.log(chalk.yellow(`Total expenses: $${totalExpenses.toFixed(2)}`));
        return;
      }
      const remaining = budget.amount - totalExpenses;
      console.log(chalk.blue(`Budget Status for ${monthKey}:`));
      console.log(chalk.yellow(`Budget: $${budget.amount.toFixed(2)}`));
      console.log(chalk.yellow(`Expenses: $${totalExpenses.toFixed(2)}`));
      console.log(chalk[remaining >= 0 ? 'green' : 'red'](`Remaining: $${remaining.toFixed(2)}`));
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error checking budget:', error.message));
      } else {
        console.error(chalk.red('Error checking budget:', String(error)));
      }
      process.exit(1);
    }
  });

export default checkBudget;