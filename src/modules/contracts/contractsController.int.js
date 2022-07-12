const request = require('supertest');
const app = require('../../app');

describe('GET /contracts/:id', () => {
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
      expect(response.body.id).toBe(contractId);
      expect([response.body.ContractorId, response.body.ClientId]).toContain(
        profile_id
      );
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
});

describe('GET /contracts', () => {
  it(`should return non terminated contracts for the profile`, async () => {
    const profile_id = 1;

    const response = await request(app)
      .get(`/contracts`)
      .set('profile_id', `${profile_id}`);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          status: expect.not.stringContaining('terminated'),
        }),
      ])
    );
    for (let i = 0; i < response.body.length; i++) {
      const contract = response.body[i];
      expect([contract.ContractorId, contract.ClientId]).toContain(profile_id);
    }
  });
});
