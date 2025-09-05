export type User = {
  name: string;
  email: string;
};

const seedUsers: Record<string, User[]> = {
  company_1: [
    {
      name: 'Alice',
      email: 'alice@company1.com',
    },
  ],
  company_2: [
    {
      name: 'Bob',
      email: 'bob@company2.com',
    },
  ],
  company_3: [
    {
      name: 'Eve',
      email: 'eve@company3.com',
    },
  ],
};

export default seedUsers;
