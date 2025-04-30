import { Command } from 'commander';
import chalk from 'chalk';
import prisma from '../db/prisma';

const deleteCmd = new Command('delete')
  .description('Delete a transaction by ID')
  .requiredOption('--id <id>', 'Transaction ID')
  .action(async (options: { id: string }) => {
    try {
      const { id } = options;
      const idNum = parseInt(id, 10);
      if (isNaN(idNum)) {
        console.error(chalk.red('ID must be a number'));
        process.exit(1);
      }
      // Check if transaction exists
      const transaction = await prisma.transaction.findUnique({
        where: { id: idNum },
      });
      if (!transaction) {
        console.error(chalk.red(`Transaction with ID ${idNum} not found`));
        process.exit(1);
      }
      await prisma.transaction.delete({
        where: { id: idNum },
      });
      console.log(chalk.green(`Transaction ${idNum} deleted: ${transaction.type} of $${transaction.amount.toFixed(2)}`));
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error deleting transaction:', error.message));
      } else {
        console.error(chalk.red('Error deleting transaction:', String(error)));
      }
      process.exit(1);
    }
  });

export default deleteCmd;