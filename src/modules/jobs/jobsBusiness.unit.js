const { canPayJob } = require('./jobsBusiness');

test(`Client can pay job`, () => {
  const result = canPayJob({
    jobId: 2,
    contracts: contractsWithJobNotPaid,
    client,
  });

  expect(result.isSuccess).toBe(true);
  expect(result.value.job.id).toBe(2);
});

test(`Client can't a pay job if it's already paid`, () => {
  const result = canPayJob({
    jobId: 2,
    contracts: contractsWithJobPaid,
    client,
  });

  expect(result.isFailure).toBe(true);
  expect(result.error.type).toBe('JobIsAlreadyPaid');
  expect(result.error.httpStatus).toBe(409);
});

test(`Trying to pay a job of a different client should fail`, () => {
  const result = canPayJob({
    jobId: 3,
    contracts: contractsWithJobNotPaid,
    client,
  });

  expect(result.isFailure).toBe(true);
  expect(result.error.type).toBe('JobNotFound');
  expect(result.error.httpStatus).toBe(404);
});

test(`Client without enough funds can't pay`, () => {
  const result = canPayJob(notEnoughFundsData);

  expect(result.isFailure).toBe(true);
  expect(result.error.type).toBe('NotEnoughFunds');
  expect(result.error.httpStatus).toBe(409);
});

const contractsWithJobNotPaid = [
  {
    id: 1,
    terms: 'bla bla bla',
    status: 'terminated',
    createdAt: '2022-07-11T20:22:37.759Z',
    updatedAt: '2022-07-11T20:22:37.759Z',
    ContractorId: 5,
    ClientId: 1,
    Jobs: [
      {
        id: 11,
        description: 'work',
        price: 21,
        paid: true,
        paymentDate: '2020-08-10T19:11:26.737Z',
        createdAt: '2022-07-11T20:22:37.761Z',
        updatedAt: '2022-07-11T20:22:37.761Z',
        ContractId: 1,
      },
      {
        id: 1,
        description: 'work',
        price: 200,
        paid: null,
        paymentDate: null,
        createdAt: '2022-07-11T20:22:37.760Z',
        updatedAt: '2022-07-11T20:22:37.760Z',
        ContractId: 1,
      },
      {
        id: 9,
        description: 'work',
        price: 200,
        paid: true,
        paymentDate: '2020-08-17T19:11:26.737Z',
        createdAt: '2022-07-11T20:22:37.760Z',
        updatedAt: '2022-07-11T20:22:37.760Z',
        ContractId: 1,
      },
    ],
  },
  {
    id: 2,
    terms: 'bla bla bla',
    status: 'in_progress',
    createdAt: '2022-07-11T20:22:37.759Z',
    updatedAt: '2022-07-11T20:22:37.759Z',
    ContractorId: 6,
    ClientId: 1,
    Jobs: [
      {
        id: 12,
        description: 'work',
        price: 21,
        paid: true,
        paymentDate: '2020-08-15T19:11:26.737Z',
        createdAt: '2022-07-11T20:22:37.761Z',
        updatedAt: '2022-07-11T20:22:37.761Z',
        ContractId: 2,
      },
      {
        id: 7,
        description: 'work',
        price: 200,
        paid: true,
        paymentDate: '2020-08-15T19:11:26.737Z',
        createdAt: '2022-07-11T20:22:37.760Z',
        updatedAt: '2022-07-11T20:22:37.760Z',
        ContractId: 2,
      },
      {
        id: 2,
        description: 'work',
        price: 201,
        paid: null,
        paymentDate: null,
        createdAt: '2022-07-11T20:22:37.760Z',
        updatedAt: '2022-07-11T20:22:37.760Z',
        ContractId: 2,
      },
    ],
  },
];
const contractsWithJobPaid = [
  {
    id: 1,
    terms: 'bla bla bla',
    status: 'terminated',
    createdAt: '2022-07-11T20:22:37.759Z',
    updatedAt: '2022-07-11T20:22:37.759Z',
    ContractorId: 5,
    ClientId: 1,
    Jobs: [
      {
        id: 11,
        description: 'work',
        price: 21,
        paid: true,
        paymentDate: '2020-08-10T19:11:26.737Z',
        createdAt: '2022-07-11T20:22:37.761Z',
        updatedAt: '2022-07-11T20:22:37.761Z',
        ContractId: 1,
      },
      {
        id: 1,
        description: 'work',
        price: 200,
        paid: null,
        paymentDate: null,
        createdAt: '2022-07-11T20:22:37.760Z',
        updatedAt: '2022-07-11T20:22:37.760Z',
        ContractId: 1,
      },
      {
        id: 9,
        description: 'work',
        price: 200,
        paid: true,
        paymentDate: '2020-08-17T19:11:26.737Z',
        createdAt: '2022-07-11T20:22:37.760Z',
        updatedAt: '2022-07-11T20:22:37.760Z',
        ContractId: 1,
      },
    ],
  },
  {
    id: 2,
    terms: 'bla bla bla',
    status: 'in_progress',
    createdAt: '2022-07-11T20:22:37.759Z',
    updatedAt: '2022-07-11T20:22:37.759Z',
    ContractorId: 6,
    ClientId: 1,
    Jobs: [
      {
        id: 12,
        description: 'work',
        price: 21,
        paid: true,
        paymentDate: '2020-08-15T19:11:26.737Z',
        createdAt: '2022-07-11T20:22:37.761Z',
        updatedAt: '2022-07-11T20:22:37.761Z',
        ContractId: 2,
      },
      {
        id: 7,
        description: 'work',
        price: 200,
        paid: true,
        paymentDate: '2020-08-15T19:11:26.737Z',
        createdAt: '2022-07-11T20:22:37.760Z',
        updatedAt: '2022-07-11T20:22:37.760Z',
        ContractId: 2,
      },
      {
        id: 2,
        description: 'work',
        price: 201,
        paid: true,
        paymentDate: null,
        createdAt: '2022-07-11T20:22:37.760Z',
        updatedAt: '2022-07-11T20:30:27.005Z',
        ContractId: 2,
      },
    ],
  },
];
const client = {
  id: 1,
  firstName: 'Harry',
  lastName: 'Potter',
  profession: 'Wizard',
  balance: 949,
  type: 'client',
  createdAt: '2022-07-11T20:22:37.758Z',
  updatedAt: '2022-07-11T20:30:26.998Z',
};
const notEnoughFundsData = {
  jobId: 5,
  contracts: [
    {
      id: 7,
      terms: 'bla bla bla',
      status: 'in_progress',
      createdAt: '2022-07-11T20:44:32.037Z',
      updatedAt: '2022-07-11T20:44:32.037Z',
      ContractorId: 7,
      ClientId: 4,
      Jobs: [
        {
          id: 5,
          description: 'work',
          price: 200,
          paid: null,
          paymentDate: null,
          createdAt: '2022-07-11T20:44:32.038Z',
          updatedAt: '2022-07-11T20:44:32.038Z',
          ContractId: 7,
        },
        {
          id: 6,
          description: 'work',
          price: 2020,
          paid: true,
          paymentDate: '2020-08-15T19:11:26.737Z',
          createdAt: '2022-07-11T20:44:32.038Z',
          updatedAt: '2022-07-11T20:44:32.038Z',
          ContractId: 7,
        },
      ],
    },
    {
      id: 8,
      terms: 'bla bla bla',
      status: 'in_progress',
      createdAt: '2022-07-11T20:44:32.037Z',
      updatedAt: '2022-07-11T20:44:32.037Z',
      ContractorId: 6,
      ClientId: 4,
      Jobs: [],
    },
    {
      id: 9,
      terms: 'bla bla bla',
      status: 'in_progress',
      createdAt: '2022-07-11T20:44:32.037Z',
      updatedAt: '2022-07-11T20:44:32.037Z',
      ContractorId: 8,
      ClientId: 4,
      Jobs: [],
    },
  ],
  client: {
    id: 4,
    firstName: 'Ash',
    lastName: 'Kethcum',
    profession: 'Pokemon master',
    balance: 1.3,
    type: 'client',
    createdAt: '2022-07-11T20:44:32.036Z',
    updatedAt: '2022-07-11T20:44:32.036Z',
  },
};
