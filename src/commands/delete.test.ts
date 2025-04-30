import { Command } from 'commander';
import deleteCommand from './delete';
import prisma from '../db/prisma';

jest.mock('../db/prisma');

describe('delete command', () => {
  let program: Command;

  beforeEach(() => {
    program = new Command();
    program.addCommand(deleteCommand);
    jest.clearAllMocks();
  });

  it('should delete an existing transaction', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const findUniqueMock = prisma.transaction.findUnique as jest.Mock;
    const deleteMock = prisma.transaction.delete as jest.Mock;
    findUniqueMock.mockResolvedValue({ id: 1, type: 'expense', amount: 50 });
    deleteMock.mockResolvedValue({});

    await program.parseAsync(['node', 'index.js', 'delete', '--id', '1']);

    expect(findUniqueMock).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(deleteMock).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Transaction 1 deleted: expense of $50.00')
    );
    consoleLogSpy.mockRestore();
  });

  it('should error if transaction does not exist', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation();
    const findUniqueMock = prisma.transaction.findUnique as jest.Mock;
    findUniqueMock.mockResolvedValue(null);

    await program.parseAsync(['node', 'index.js', 'delete', '--id', '1']);

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Transaction with ID 1 not found'));
    expect(exitSpy).toHaveBeenCalledWith(1);
    consoleErrorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('should error if ID is not a number', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation();

    await program.parseAsync(['node', 'index.js', 'delete', '--id', 'invalid']);

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('ID must be a number'));
    expect(exitSpy).toHaveBeenCalledWith(1);
    consoleErrorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});