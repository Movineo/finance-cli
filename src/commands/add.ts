import { Command } from 'commander';
import chalk from 'chalk';
import prisma from '../db/prisma';

const add = new Command('add')
  .description('Add a new transaction')
  .requiredOption('--type <type>', 'Transaction type (expense/income)')
  .requiredOption('--amount <amount>', 'Transaction amount')
  .option('--category <category>', 'Transaction category', 'general')
  .option('--description <description>', 'Transaction description', '')
  .action(async (options: { type: string; amount: string; category: string; description: string }) => {
    try {
      const { type, amount, category, description } = options;
      if (!['expense', 'income'].includes(type)) {
        console.error(chalk.red('Type must be "expense" or "income"'));
        process.exit(1);
      }
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        console.error(chalk.red('Amount must be a positive number'));
        process.exit(1);
      }
      await prisma.transaction.create({
        data: {
          type,
          amount: amountNum,
          category,
          description,
        },
      });
      console.log(chalk.green(`Transaction added: ${type} of $${amountNum} in ${category}`));
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error adding transaction:', error.message));
      } else {
        console.error(chalk.red('Error adding transaction:', String(error)));
      }
      process.exit(1);
    }
  });

export default add;