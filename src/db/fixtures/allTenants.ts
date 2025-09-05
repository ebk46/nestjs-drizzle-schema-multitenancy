export type Tenant = {
  name: string;
  schemaName: string;
  domain: string;
};

const allTenants: Record<string, Tenant> = {
  company_1: {
    name: 'Company 1',
    schemaName: 'company_1',
    domain: 'company1.com',
  },
  company_2: {
    name: 'Company 2',
    schemaName: 'company_2',
    domain: 'company2.com',
  },
  company_3: {
    name: 'Company 3',
    schemaName: 'company_3',
    domain: 'company3.com',
  },
};

export default allTenants;
