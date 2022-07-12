const request = require('supertest');
const app = require('../../app');

it(`should return non terminated contracts for the profile`, async () => {
  const profile_id = 1;

  const response = await request(app)
    .get(`/contracts`)
    .set('profile_id', `${profile_id}`);

  expect(response.status).toBe(200);
  expect(response.body.contracts).toStrictEqual(
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
