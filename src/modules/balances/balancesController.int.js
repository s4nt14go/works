const request = require('supertest');
const app = require('../../app');
const { Profile } = require('../../model');

test(`POST /balances/deposit/:userId`, async () => {
  const userId = 1;
  const amount = 100;
  const initialBalance = await getBalance(userId);

  const response = await request(app)
    .post(`/balances/deposit/${userId}`)
    .send({ deposit: amount });

  expect(response.status).toBe(200);
  const finalBalance = await getBalance(userId);
  expect(finalBalance).toBe(initialBalance + amount);
});

async function getBalance(id) {
  const profile = await Profile.findOne({
    where: {
      id,
    },
  });
  return profile.balance;
}
