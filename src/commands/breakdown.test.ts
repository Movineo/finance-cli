import { Command } from 'commander';
import breakdownCommand from './breakdown';
import prisma from '../db/prisma';

jest.mock('../db/prisma');

describe('breakdown command', () => {
  let program: Command;

  beforeEach(() => {
    program = new Command();
    program.addCommand(breakdownCommand);
    jest.clearAllMocks();
  });

  it('should display breakdown with chart', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const groupByMock = prisma.transaction.groupBy as jest.Mock;
    groupByMock.mockResolvedValue([
      { category: 'rent', _sum: { amount: 200 } },
      { category: 'food', _sum: { amount: 50 } },
    ]);

    await program.parseAsync(['node', 'index.js', 'breakdown']);

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('rent: $200.00'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('food: $50.00'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Spending Chart'));
    consoleLogSpy.mockRestore();
  });

  it('should display no expenses message if none exist', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const groupByMock = prisma.transaction.groupBy as jest.Mock;
    groupByMock.mockResolvedValue([]);

    await program.parseAsync(['node', 'index.js', 'breakdown']);

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('No expenses recorded this month'));
    consoleLogSpy.mockRestore();
  });
  it('should not display chart with --no-chart option', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const groupByMock = prisma.transaction.groupBy as jest.Mock;
    groupByMock.mockResolvedValue([
      { category: 'rent', _sum: { amount: 200 } },
      { category: 'food', _sum: { amount: 50 } },
    ]);
  
    await program.parseAsync(['node', 'index.js', 'breakdown', '--no-chart']);
  
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('rent: $200.00'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('food: $50.00'));
    expect(consoleLogSpy).not.toHaveBeenCalledWith(expect.stringContaining('Spending Chart'));
    consoleLogSpy.mockRestore();
  });
});
