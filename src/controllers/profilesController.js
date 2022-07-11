const { canDeposit } = require('../business/profilesBusiness');
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

  const result = canDeposit({ contracts, client, deposit });
  if (result.isFailure)
    return res
      .status(result.error.httpStatus)
      .send({
        message: result.error.message,
        type: result.error.type,
      })
      .end();

  await client.increment({ balance: deposit });

  res.json();
};
