// src/commands/add.test.ts
import { Command } from 'commander';
import addCommand from './add';
import prisma from '../db/prisma';

jest.mock('../db/prisma');

describe('add command', () => {
  let program: Command;

  beforeEach(() => {
    program = new Command();
    program.addCommand(addCommand);
    jest.clearAllMocks();
  });

  it('should add a valid expense transaction', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const createMock = prisma.transaction.create as jest.Mock;
    createMock.mockResolvedValue({});

    await program.parseAsync([
      'node',
      'index.js',
      'add',
      '--type',
      'expense',
      '--amount',
      '50',
      '--category',
      'food',
      '--description',
      'Lunch',
    ]);

    expect(createMock).toHaveBeenCalledWith({
      data: {
        type: 'expense',
        amount: 50,
        category: 'food',
        description: 'Lunch',
      },
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Transaction added: expense of $50 in food')
    );
    consoleLogSpy.mockRestore();
  });

  it('should add a valid income transaction', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const createMock = prisma.transaction.create as jest.Mock;
    createMock.mockResolvedValue({});

    await program.parseAsync([
      'node',
      'index.js',
      'add',
      '--type',
      'income',
      '--amount',
      '100',
      '--category',
      'salary',
      '--description',
      'Paycheck',
    ]);

    expect(createMock).toHaveBeenCalledWith({
      data: {
        type: 'income',
        amount: 100,
        category: 'salary',
        description: 'Paycheck',
      },
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Transaction added: income of $100 in salary')
    );
    consoleLogSpy.mockRestore();
  });

  it('should reject invalid type', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation();

    await program.parseAsync(['node', 'index.js', 'add', '--type', 'invalid', '--amount', '50']);

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Type must be "expense" or "income"'));
    expect(exitSpy).toHaveBeenCalledWith(1);
    consoleErrorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});