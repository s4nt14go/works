const request = require('supertest');
const app = require('../../app');

test.each([
  [1, 5],
  [3, 2],
])(
  'Getting contract %i with client or contractor profile %i should receive the contract',
  async function (contractId, profile_id) {
    const response = await request(app)
      .get(`/contracts/${contractId}`)
      .set('profile_id', `${profile_id}`);

    expect(response.status).toBe(200);
    expect(response.body.contract.id).toBe(contractId);
    expect([
      response.body.contract.ContractorId,
      response.body.contract.ClientId,
    ]).toContain(profile_id);
  }
);

test(`Don't allow getting a contract with a profile that isn't its client or contractor`, async () => {
  const contractId = 1;
  const profile_id = 2;

  const response = await request(app)
    .get(`/contracts/${contractId}`)
    .set('profile_id', `${profile_id}`);

  expect(response.status).toBe(404);
});
