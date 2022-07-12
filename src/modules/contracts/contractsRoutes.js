const { getProfile } = require('./../../middleware/getProfile');
const contractsController = require('./../../modules/contracts/contractsController');
const { Router } = require('express');
const router = new Router();

router.get('/:id', getProfile, (req, res) => contractsController.byId(req, res));

router.get('/', getProfile, (req, res) =>
  contractsController.getContracts(req, res)
);

module.exports = router;
