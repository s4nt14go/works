const { getProfile } = require('./../../middleware/getProfile');
const { Router } = require('express');
const GetContractsController = require('./GetContractsController');
const GetByIdController = require('./GetByIdController');
const router = new Router();

router.get('/:id', getProfile, async (req, res) => {
  const getById = new GetByIdController(req, res);
  return await getById.execute();
});

router.get('/', getProfile, async (req, res) => {
  const getContracts = new GetContractsController(req, res);
  return await getContracts.execute();
});

module.exports = router;
