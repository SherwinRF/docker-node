const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const protect = require('../middleware/authMiddleware');

router.route("/")
        .get(postController.getAllPosts)
        .post(postController.createPost);
        // .get(protect, postController.getAllPosts) // only logged in users can GET!
        // .post(protect, postController.createPost); // only logged in users can POST!

router.route("/:id")
        .get(postController.getOnePost)
        .patch(postController.updatePost)
        .delete(postController.deletePost);

module.exports = router;
