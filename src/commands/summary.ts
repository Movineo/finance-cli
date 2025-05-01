import { Command } from 'commander';
import chalk from 'chalk';
import prisma from '../db/prisma';

const summary = new Command('summary')
  .description('View financial summary for the current month or multiple months')
  .option('--months <months>', 'Number of months to summarize (default: 1)', '1')
  .action(async (options: { months: string }) => {
    try {
      const months = parseInt(options.months, 10);
      if (isNaN(months) || months < 1) {
        console.error(chalk.red('Months must be a positive number'));
        process.exit(1);
      }
      const endDate = new Date();
      const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - months + 1, 1);
      const transactions = await prisma.transaction.groupBy({
        by: ['type'],
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: {
          amount: true,
        },
      });
      let expenses = 0;
      let income = 0;
      transactions.forEach((t) => {
        if (t.type === 'expense') expenses = t._sum.amount || 0;
        if (t.type === 'income') income = t._sum.amount || 0;
      });
      const balance = income - expenses;
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      console.log(chalk.blue(`Summary for ${months} Month${months > 1 ? 's' : ''} (${startDateStr} to ${endDateStr}):`));
      console.log(chalk.yellow(`Income: $${income.toFixed(2)}`));
      console.log(chalk.yellow(`Expenses: $${expenses.toFixed(2)}`));
      console.log(chalk.green(`Balance: $${balance.toFixed(2)}`));
    } catch (error) {
      console.error(chalk.red('Error fetching summary:', (error as Error).message));
      process.exit(1);
    }
  });

export default summary;