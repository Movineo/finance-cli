import { Command } from 'commander';
import chalk from 'chalk';
import prisma from '../db/prisma';

const list = new Command('list')
  .description('List recent transactions')
  .option('--limit <limit>', 'Number of transactions to show', '10')
  .action(async (options: { limit: string }) => {
    try {
      const limit = parseInt(options.limit, 10);
      if (isNaN(limit) || limit <= 0) {
        console.error(chalk.red('Limit must be a positive number'));
        process.exit(1);
      }
      const transactions = await prisma.transaction.findMany({
        take: limit,
        orderBy: { date: 'desc' },
      });
      console.log(chalk.blue(`Recent Transactions (up to ${limit}):`));
      if (transactions.length === 0) {
        console.log(chalk.yellow('No transactions found.'));
        return;
      }
      transactions.forEach((t) => {
        console.log(
          chalk.yellow(
            `${t.id}: ${t.type} of $${t.amount.toFixed(2)} in ${t.category} on ${t.date.toISOString().split('T')[0]} - ${t.description}`
          )
        );
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error listing transactions:', error.message));
      } else {
        console.error(chalk.red('Error listing transactions:', String(error)));
      }
      process.exit(1);
    }
  });

export default list;