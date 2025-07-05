const express = require('express');
const router = express.Router();
const {
  getAllRoadmapItems,
  getRoadmapItem
} = require('../Controllers/RoadmapItemController');
const ensureAuthenticated = require('../Middlewares/Auth');

router.use(ensureAuthenticated);

router.get('/', getAllRoadmapItems);
router.get('/:id', getRoadmapItem);

module.exports = router;