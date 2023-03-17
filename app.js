const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.locals._ = _; // odkazujeme do všech local files, že _ (lodash) v nich odpovídá také _

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


app.set("view engine", "ejs"); // DOPLNIT

app.use(express.urlencoded({extended: true})); // DOPLNIT
app.use(express.static("public")); // DOPLNIT


// Connecting with MongoDB Atlas
mongoose.connect("mongodb+srv://OndraS:bloody44@cluster0.lsbfvmo.mongodb.net/BlogWebpage");

//Create post schema
const postSchema = new mongoose.Schema({
  postTitle: String,
  postContent: String,
  postDate: {
    type: Date,
    default: Date.now
  }
});

// Create collection/model
const Post = mongoose.model("Post", postSchema);

// HOME
app.get(["/", "/home"],(req, res) => {
  Post.find({})
    .then((posts) => {
      res.render("home", {
        paragraphHome: homeStartingContent, 
        posts: posts
      });
    })
    .catch(function (err) {
      console.log(err);
    });
});

// ABOUT
app.get("/about", (req, res) => {
  res.render("about", {
    paragraphAbout: aboutContent
  });
});

//CONTACT 
app.get("/contact", (req, res) => {
  res.render("contact", {
    paragraphContact: contactContent
  });
});

// COMPOSE
app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  let postTitle = req.body.composeTitle;
  let postContent = req.body.composePost;

  const post = new Post ({
    postTitle: postTitle,
    postContent: postContent
  });

  post.save();
  res.redirect("/");
})

app.get("/post/:postId", (req, res) => { 
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId})
    .then((posts) => {
      res.render("post", {
        postTitle: posts.postTitle,
        postContent: posts.postContent,
        postDate: posts.postDate
      });
    })
    .catch(function (err) {
      console.log(err);
    });

  
})
// :postId představuje pouze název paramentru ne jeho hodnotu. Místo něho můžeme napsat jakékoliv slovo, které se ale bude ve finále ukládat a následně volat pod parametrem postName

app.post("/delete", (req, res) => {
  const deletePostId = req.body.deleteId;
  
  Post.findByIdAndDelete({ _id: deletePostId })
  .then(() => {
    res.redirect("/");
  })
  .catch((err) => {
    console.log(err);
  })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})