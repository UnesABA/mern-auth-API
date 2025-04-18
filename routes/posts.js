const router = require("express").Router()
const Post   = require("../models/Post")
const User   = require("../models/user")

// create a post
  router.post("/", async(req, res) =>{
    const newPost  = new Post(req.body)
    try {
      const savedPost = await newPost.save()
      res.status(200).json(savedPost)
    } catch (error) {
      res.status(500).json(error)
    }
  })

// update a post
  router.put("/:id", async(req, res) =>{
    try {
      const post = await Post.findById(req.params.id)
      if (post.userId === req.body.userId) {
        await post.updateOne({$set:req.body})
        res.status(200).json("Your post has been updated successfully ^^")
      } else {
        res.status(403).json("You can update only your post")
      }
    } catch (error) {
      res.status(500).json(error)
    }
  })

// delete a post
router.delete("/:id", async(req, res) =>{
  try {
    const post = await Post.findById(req.params.id)
    if (post.userId === req.body.userId) {
      await post.deleteOne({$set:req.body})
      res.status(200).json("Your post has been deleted successfully ^^")
    } else {
      res.status(403).json("You can delete only your post")
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

// like/dislike a post
router.put("/:id/like", async(req, res) =>{
  try {
    const post = await Post.findById(req.params.id)
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({$push: {likes: req.body.userId}})
      res.status(200).json("The post has been liked successfully ^^")
    } else {
      await post.updateOne({$pull: {likes: req.body.userId}})
      res.status(200).json("The post has been disliked successfully ^^")
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

// get a post
router.get("/:id", async(req, res) =>{
  try {
    const post = await Post.findById(req.params.id)
    res.status(200).json(post)
  } catch (error) {
    res.status(500).json(error)
  }
})

// get timeline posts
router.get("/timeline/:userId", async(req, res) =>{
  try {
    const currentUser = await User.findById(req.params.userId)
    const userPosts   = await Post.find({userId: currentUser._id})
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) =>{
        return Post.find({userId: friendId})
      })
    )
    res.json(userPosts.concat(...friendPosts))
  } catch (error) {
    res.status(500).json(error)
  }
})

// get user's all posts
router.get("/profile/:username", async(req, res) =>{
  try {
    const user = await User.findOne({ username:req.params.username })
    const posts = await Post.find({ userId:user._id })
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router