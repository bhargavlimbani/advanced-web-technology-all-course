const express = require("express");
const router = express.Router();

const {
    createBlog,
    getBlogs,
    updateBlog,
    deleteBlog
} = require("../controllers/blogController");

router.post("/", createBlog);
router.get("/", getBlogs);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;