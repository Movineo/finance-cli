import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function connectWithRetry(retries = 5, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      return prisma;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Initialize connection on import
connectWithRetry().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to connect to database:', error);
  process.exit(1);
});

export default prisma;
