#!/usr/bin/env node
import { program } from 'commander';
import addCommand from './commands/add';
import summaryCommand from './commands/summary';
import exportCommand from './commands/export';
import breakdownCommand from './commands/breakdown';
import setBudgetCommand from './commands/set-budget';
import checkBudgetCommand from './commands/check-budget';
import listCommand from './commands/list';
import deleteCommand from './commands/delete';

program
  .version('1.0.0')
  .description('Personal Finance Tracker CLI - Manage expenses, income, and budgets with ASCII charts');

program.addCommand(addCommand);
program.addCommand(summaryCommand);
program.addCommand(exportCommand);
program.addCommand(breakdownCommand);
program.addCommand(setBudgetCommand);
program.addCommand(checkBudgetCommand);
program.addCommand(listCommand);
program.addCommand(deleteCommand);

program.parse(process.argv);