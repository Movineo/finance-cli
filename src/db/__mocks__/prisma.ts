const prisma = {
  transaction: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
    groupBy: jest.fn(),
    aggregate: jest.fn(),
  },
  budget: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
  },
};

export default prisma; 