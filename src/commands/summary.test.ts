import { Command } from 'commander';
import summaryCommand from './summary';
import prisma from '../db/prisma';

jest.mock('../db/prisma');

describe('summary command', () => {
  let program: Command;

  beforeEach(() => {
    program = new Command();
    program.addCommand(summaryCommand);
    jest.clearAllMocks();
  });

  it('should display summary with expenses and income', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const groupByMock = prisma.transaction.groupBy as jest.Mock;
    groupByMock.mockResolvedValue([
      { type: 'expense', _sum: { amount: 200 } },
      { type: 'income', _sum: { amount: 500 } },
    ]);

    await program.parseAsync(['node', 'index.js', 'summary']);

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Income: $500.00'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Expenses: $200.00'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Balance: $300.00'));
    consoleLogSpy.mockRestore();
  });
});