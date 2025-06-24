const express = require('express');
const router = express.Router();
const { upvoteItem, getUserUpvotes, getUpvoteCount } = require('../Controllers/UpvoteController');
const ensureAuthenticated = require('../Middlewares/Auth');

router.use(ensureAuthenticated);

router.post('/:roadmapItemId', upvoteItem);

router.get('/user/:userId', getUserUpvotes);

router.get('/count/:roadmapItemId', getUpvoteCount);

module.exports = router;