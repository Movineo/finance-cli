import { Command } from 'commander';
import checkBudgetCommand from './check-budget';
import prisma from '../db/prisma';

jest.mock('../db/prisma');

describe('check-budget command', () => {
  let program: Command;

  beforeEach(() => {
    program = new Command();
    program.addCommand(checkBudgetCommand);
    jest.clearAllMocks();
  });

  it('should display budget status with remaining amount', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const findUniqueMock = prisma.budget.findUnique as jest.Mock;
    const aggregateMock = prisma.transaction.aggregate as jest.Mock;
    findUniqueMock.mockResolvedValue({ month: '2025-04', amount: 1000 });
    aggregateMock.mockResolvedValue({ _sum: { amount: 200 } });

    await program.parseAsync(['node', 'index.js', 'check-budget']);

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Budget: $1000.00'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Expenses: $200.00'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Remaining: $800.00'));
    consoleLogSpy.mockRestore();
  });

  it('should display no budget message if none set', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const findUniqueMock = prisma.budget.findUnique as jest.Mock;
    const aggregateMock = prisma.transaction.aggregate as jest.Mock;
    findUniqueMock.mockResolvedValue(null);
    aggregateMock.mockResolvedValue({ _sum: { amount: 200 } });

    await program.parseAsync(['node', 'index.js', 'check-budget']);

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('No budget set for this month'));
    consoleLogSpy.mockRestore();
  });
});