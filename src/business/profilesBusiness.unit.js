const { canDeposit } = require('./profilesBusiness');

test(`Client can deposit`, () => {
  const result = canDeposit({
    ...depositData,
    deposit: 50,
  });

  expect(result.isSuccess).toBe(true);
});

test(`Client can't deposit if they exceed maximum amount`, () => {
  const result = canDeposit({
    ...depositData,
    deposit: 51,
  });

  expect(result.isFailure).toBe(true);
  expect(result.error.type).toBe('MaximumDepositExceeded');
  expect(result.error.httpStatus).toBe(400);
});

test(`Client can't deposit if they don't have jobs to pay`, () => {
  const result = canDeposit(noJobsToPayData);

  expect(result.isFailure).toBe(true);
  expect(result.error.type).toBe('NoJobsToPay');
  expect(result.error.httpStatus).toBe(404);
});

const depositData = {
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
    balance: 151.3,
    type: 'client',
    createdAt: '2022-07-11T20:44:32.036Z',
    updatedAt: '2022-07-11T22:03:08.098Z',
  },
};
const noJobsToPayData = {
  contracts: [
    {
      id: 5,
      terms: 'bla bla bla',
      status: 'new',
      createdAt: '2022-07-11T20:44:32.037Z',
      updatedAt: '2022-07-11T20:44:32.037Z',
      ContractorId: 8,
      ClientId: 3,
      Jobs: [
        {
          id: 10,
          description: 'work',
          price: 200,
          paid: true,
          paymentDate: '2020-08-17T19:11:26.737Z',
          createdAt: '2022-07-11T20:44:32.038Z',
          updatedAt: '2022-07-11T20:44:32.038Z',
          ContractId: 5,
        },
      ],
    },
    {
      id: 6,
      terms: 'bla bla bla',
      status: 'in_progress',
      createdAt: '2022-07-11T20:44:32.037Z',
      updatedAt: '2022-07-11T20:44:32.037Z',
      ContractorId: 7,
      ClientId: 3,
      Jobs: [],
    },
  ],
  client: {
    id: 3,
    firstName: 'John',
    lastName: 'Snow',
    profession: 'Knows nothing',
    balance: 451.3,
    type: 'client',
    createdAt: '2022-07-11T20:44:32.036Z',
    updatedAt: '2022-07-11T20:44:32.036Z',
  },
  deposit: 1,
};
