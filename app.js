//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');
var lowerCase = require('lodash.lowercase');

const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

mongoose.connect('mongodb://localhost/blogDB', {
  useNewUrlParser: true
});

const blogSchema = mongoose.Schema({
  title: String,
  content: String
});

const Blog = mongoose.model("Post", blogSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

//var posts = [];

app.get("/", function(req, res) {
  Blog.find({}, function(err, posts) {
    res.render("home", {
      homeContent: homeStartingContent,
      posts: posts
    });
  });
});

app.get('/about', function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get('/contact', function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get('/compose', function(req, res) {
  res.render("compose");
});

app.post('/compose', function(req, res) {
  const post = new Blog({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/post/:postId", function(req, res) {

  const postId = req.params.postId;
  Blog.findOne({_id: postId}, function(err, post) {

    if (!err) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
