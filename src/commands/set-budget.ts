import { Command } from 'commander';
import chalk from 'chalk';
import prisma from '../db/prisma';

const setBudget = new Command('set-budget')
  .description('Set a monthly budget')
  .requiredOption('--amount <amount>', 'Budget amount')
  .action(async (options: { amount: string }) => {
    try {
      const { amount } = options;
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        console.error(chalk.red('Amount must be a positive number'));
        process.exit(1);
      }
      const currentDate = new Date();
      const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      await prisma.budget.upsert({
        where: { month: monthKey },
        update: { amount: amountNum },
        create: { month: monthKey, amount: amountNum },
      });
      console.log(chalk.green(`Budget set: $${amountNum} for ${monthKey}`));
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error setting budget:', error.message));
      } else {
        console.error(chalk.red('Error setting budget:', String(error)));
      }
      process.exit(1);
    }
  });

export default setBudget;