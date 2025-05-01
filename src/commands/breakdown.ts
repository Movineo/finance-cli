import { Command } from 'commander';
import chalk from 'chalk';
import * as asciichart from 'asciichart';
import prisma from '../db/prisma';

const breakdown = new Command('breakdown')
  .description('View spending breakdown by category for the current month with ASCII chart')
  .option('--no-chart', 'Disable ASCII chart')
  .action(async (options) => {
    try {
      // Debug option parsing
      console.log('Options:', options);
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const categories = await prisma.transaction.groupBy({
        by: ['category'],
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
      const totalExpenses = categories.reduce((sum, cat) => sum + (cat._sum.amount || 0), 0);
      console.log(chalk.blue('Monthly Spending by Category:'));
      if (categories.length === 0) {
        console.log(chalk.yellow('No expenses recorded this month.'));
        return;
      }
      categories.forEach((cat) => {
        const amount = cat._sum.amount || 0;
        const percentage = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(2) : '0.00';
        console.log(chalk.yellow(`- ${cat.category}: $${amount.toFixed(2)} (${percentage}%)`));
      });
      if (options.chart) {
        const chartData = categories.map((cat) => cat._sum.amount || 0);
        const chartLabels = categories.map((cat) => cat.category);
        console.log(chalk.blue('\nSpending Chart:'));
        console.log(
          asciichart.plot(chartData, {
            height: 10,
            format: (x) => `$${x.toFixed(2)}`,
            colors: [asciichart.blue],
          })
        );
        console.log('Categories:', chartLabels.join(', '));
      }
    } catch (error) {
      console.error(chalk.red('Error fetching breakdown:', (error as Error).message));
      process.exit(1);
    }
  });

export default breakdown;