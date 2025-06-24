const express = require('express');
const router = express.Router();
const { addComment, editComment, deleteComment, getComments } = require('../Controllers/CommentController');
const ensureAuthenticated = require('../Middlewares/Auth');

router.use(ensureAuthenticated);

router.post('/:roadmapItemId', addComment);

router.put('/:commentId', editComment);

router.delete('/:commentId', deleteComment);

router.get('/:roadmapItemId', getComments);

module.exports = router;