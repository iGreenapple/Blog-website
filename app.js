const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();
const port = 3000;

app.locals._ = _; // odkazujeme do všech local files, že _ (lodash) v nich odpovídá také _

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


app.set("view engine", "ejs"); // DOPLNIT

app.use(express.urlencoded({extended: true})); // DOPLNIT
app.use(express.static("public")); // DOPLNIT


let listOfPosts = [
  {
    title: "Hello",
    content: contactContent
  },
  {
    title: "Good evening",
    content: aboutContent
  }
];

// HOME
app.get(["/", "/home"],(req, res) => {
  res.render("home", {
    paragraphHome: homeStartingContent, 
    posts: listOfPosts
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
  res.render("compose", {
    paragraphContact: contactContent
  });
  
});

app.post("/compose", (req, res) => {
  let postTitle = req.body.composeTitle;
  let postContent = req.body.composePost;
  let postDate = new Date().toLocaleDateString("cs-CZ");;
  
  const post = {
    title: postTitle ,
    content: postContent, 
    date: postDate
  };
  listOfPosts.push(post);
  console.log(listOfPosts);
  res.redirect("/");
})

//POST

// app.get("/post", (req, res) => {
//   res.render("post", {
//     posts: listOfPosts
//   });
// });


app.get("/post/:postName", (req, res) => { 
  let requestedPost = _.kebabCase(req.params.postName);

  listOfPosts.forEach((post) => {
    const storedPost = _.kebabCase(post.title);
    
    if (storedPost === requestedPost) {
      res.render("post", {
        postTitle: post.title,
        postText: post.content,
        postDate: post.date
      });
    }
  });
})
// :postName představuje pouze název paramentru ne jeho hodnotu. Místo něho můžeme napsat jakékoliv slovo, které se ale bude ve finále ukládat a následně volat pod parametrem postName

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})