/**
 * Client deposit
 * @param {string} req.params.userId Profile id
 * @param {number} req.body.deposit Amount
 * @returns void
 */
module.exports.deposit = async (req, res) => {
  const { userId } = req.params;
  const { deposit: depositRaw } = req.body;

  const deposit = Number(depositRaw);
  if (isNaN(deposit))
    return res
      .status(400)
      .send({
        message: `Deposit isn't a number: ${depositRaw}`,
      })
      .end();

  const { Profile, Contract, Job } = req.app.get('models');

  const client = await Profile.findOne({
    where: {
      id: userId,
      type: 'client',
    },
  });
  if (!client)
    return res
      .status(401)
      .send({
        message: `No client found with id: ${userId}`,
      })
      .end();

  const contracts = await Contract.findAll({
    where: {
      ClientId: client.id,
    },
    include: Job,
  });

  let jobsToPay = 0;
  contracts.map((contract) => {
    contract.Jobs.map((job) => {
      if (!job.paid) {
        jobsToPay += job.price;
      }
    });
  });

  // A client can't deposit more than 25% his total of jobs to pay
  const maxDeposit = jobsToPay / 4;
  if (maxDeposit === 0)
    return res
      .status(400)
      .send({
        message: `Client doesn't have jobs to pay`,
      })
      .end();

  if (deposit > maxDeposit)
    return res
      .status(400)
      .send({
        message: `Client can't deposit more than 25% his total of jobs to pay. Maximum deposit allowed: ${maxDeposit}`,
      })
      .end();

  await client.increment({ balance: deposit });

  res.json();
};
