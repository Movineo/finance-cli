import { Command } from 'commander';
import chalk from 'chalk';
import { createObjectCsvWriter } from 'csv-writer';
import prisma from '../db/prisma';

const exportCmd = new Command('export')
  .description('Export transactions to CSV')
  .requiredOption('--file <file>', 'Output CSV file path')
  .action(async (options: { file: string }) => {
    try {
      const { file } = options;
      const transactions = await prisma.transaction.findMany();
      const csvWriter = createObjectCsvWriter({
        path: file,
        header: [
          { id: 'id', title: 'ID' },
          { id: 'type', title: 'Type' },
          { id: 'amount', title: 'Amount' },
          { id: 'category', title: 'Category' },
          { id: 'description', title: 'Description' },
          { id: 'date', title: 'Date' },
        ],
      });
      await csvWriter.writeRecords(transactions);
      console.log(chalk.green(`Transactions exported to ${file}`));
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error exporting to CSV:', error.message));
      } else {
        console.error(chalk.red('Error exporting to CSV:', String(error)));
      }
      process.exit(1);
    }
  });

export default exportCmd;