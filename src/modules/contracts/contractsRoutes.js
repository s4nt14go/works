const { getProfile } = require('./../../middleware/getProfile');
const contractsController = require('./../../modules/contracts/contractsController');
const { Router } = require('express');
const GetContractsController = require('./GetContractsController');
const router = new Router();

router.get('/:id', getProfile, (req, res) => contractsController.byId(req, res));

router.get('/', getProfile, async (req, res) => {
  const getContracts = new GetContractsController(req, res);
  return await getContracts.execute();
});

module.exports = router;
