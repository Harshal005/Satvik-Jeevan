var express = require("express");
var router = express.Router();
var userModel = require("./users");
// var adminModel = require("./admins");
const path = require("path");
var postModel = require("./posts");
var fbrequestModel = require("../models/Fbrequests");
var likeModel = require("../models/Like");
const localStratergy = require("passport-local");
// const localStratergy1 = require('passport-local');
const passport = require("passport");
// const passport1 = require('passport');
passport.use(new localStratergy(userModel.authenticate()));
// passport1.use(new localStratergy1(adminModel.authenticate()));

const upload = require("./multer");
const { execPath } = require("process");

// /* GET home page. */
// router.get("/", async function (req, res, next) {
//   let user1;
//   if (req.session.passport && req.session.passport.user) {
//     user1 = await userModel.findOne({
//       username: req.session.passport.user,
//     });
//     console.log(user1);
//   }

//   const testomonials = await fbrequestModel.find({});

//   if (req.session.passport && req.session.passport.user) {
//     const user = await userModel.findOne({
//       username: req.session.passport.user,
//     });
//     if (user) {
//       // console.log(typeof user);
//       res.render("home", { user, testomonials, nav: "userLoggedIn" });
//     }
//   }

//   res.render("home", { user1, testomonials, nav: "userNotLoggedIn" });
// });

router.get("/", async function (req, res, next) {
  let user;
  let nav = "userNotLoggedIn";

  if (req.session.passport && req.session.passport.user) {
    user = await userModel.findOne({
      username: req.session.passport.user,
    });
    if (user) {
      nav = "userLoggedIn";
    }
  }

  const testomonials = await fbrequestModel.find({}).populate({
    path : 'user',
    select : 'profileimage'
  });
  // const testuser = await fbrequestModel.find({user:testomonials.user});
  console.log("Printing testuser : ",testomonials);

  res.render("home", { user, testomonials, nav});
});

router.get('/play', function(req,res){
  res.render('playvideo');
});


router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res, next) {
    // req.flash('error','Invalid Username or Password');
    // res.render('login')
  }
);

router.get("/login", function (req, res, next) {
  // console.log(req.flash("error"));
  const showerror = req.flash("error");
  res.render("login", { showerror, nav: false });
});

router.get("/profile", isLoggedIn, async function (req, res) {
  const user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("uploadedposts")
    .populate("likedposts");
  console.log(user);
  let addpermission;
  if(user.usertype == 1){
    addpermission = 1;
  }
  else{
    addpermission = 0;
  }

  let likedPostImage;
  if (user.likedposts.length > 0) {
    const firstLikedPost = user.likedposts[0];
    const postId = firstLikedPost.post;
    const post = await postModel.findById(postId);
    if (post && post.image) {
      likedPostImage = post.image;
    }
  }
  // console.log(addpermission);
  const status = "online";
  res.render("profile", { user,likedPostImage, nav: "userLoggedIn", status, addpermission });
});

router.get("/add", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user });

  res.render("add", { user, nav: "userLoggedIn" });
});

router.post(
  "/createpost",
  isLoggedIn,
  upload.single("postfile"),
  async function (req, res) {
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    const post = await postModel.create({
      user: user._id,
      title: req.body.title,
      description: req.body.description,
      image: req.file.filename,
      category: req.body.post_category,
    });

    user.uploadedposts.push(post._id);
    await user.save();
    res.redirect("/profile");
  }
);

router.post(
  "/trainerrequest",
  isLoggedIn,
  upload.single("certificate"),
  async function (req, res, next) {

    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    const userrqst = await userModel.updateOne(
      {_id:user},
      { $set :{
        fullname: req.body.fullname,
        Gender: req.body.gender,
        Expertise: req.body.trainerqualification,
        Experience : req.body.experience,
        Certificate : req.file.filename
      }
    });
    console.log(userrqst);
    // await userrqst.save();
    
    res.redirect("thanks");
  }
);

router.post(
  "/fileupload",
  isLoggedIn,
  upload.single("profileimage"),
  async function (req, res, next) {
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    user.profileimage = req.file.filename;
    await user.save();
    res.redirect("/profile");
    // res.send("uploaded");
  }
);

router.get("/feed", async function (req, res, next) {
  try {
    // Fetch posts from the database
    const posts = await postModel.find().populate("user").exec();
    // console.log(posts);
    // Render feed page with posts
    res.render("feed", { posts, nav: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/feedback", isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render("feedback", { user, nav: "userLoggedIn" });
});

router.post("/feedback", isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const fbrqst = await fbrequestModel.create({
    user: user._id,
    username: req.body.name,
    feedback: req.body.feedbackdesc,
  });
  res.render("thanks", { user, nav: "userLoggedIn" });
});

router.get("/register", function (req, res) {
  res.render("register", { nav: false });
});

router.post("/register", async function (req, res) {
  const existedUser = await userModel.findOne({ username: req.body.username });
  console.log(existedUser);
  if (existedUser) {
    return res.status(400).send("username already exists");
  }

  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    contact: req.body.phonenumber,
    password: req.body.password,
  });

  userModel.register(userData, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/");
    });
  });
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

router.get("/thanks", function (req, res, next) {
  res.render("thanks", { nav: "userNotLoggedIn" });
});

router.get("/applyfortrainer", isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render("applytrainer", { nav: "userLoggedIn", user });
});

router.get("/show/upldedposts", isLoggedIn, async function (req, res) {
  const user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("uploadedposts");
  const uploadedposts = await postModel.find({user:user});

  console.log(uploadedposts);
  res.render("showuploaded", { user, nav: "userLoggedIn" });
});

// router.get("/show/likedposts", isLoggedIn, async function (req, res) {
//   const user = await userModel
//     .findOne({ username: req.session.passport.user });
//     await user.populate('likedposts').execPopulate();
//   const likedposts = await likeModel.find({ user: user });

//   console.log(likedposts);
//   res.render("showliked", { user, nav: "userLoggedIn" });
// });

router.get("/show/likedposts", isLoggedIn, async function (req, res) {
  try {
    // Find the user who is currently logged in
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Find all likes by the user
    const likes = await likeModel.find({ user: user._id });

    // Extract the IDs of the liked posts
    const likedPostIds = likes.map((like) => like.post);

    // Find the details of the liked posts
    const likedPosts = await postModel.find({ _id: { $in: likedPostIds } });
    console.log(likedPosts);

    res.render("showliked", { user, likedPosts, nav: "userLoggedIn" }); // Pass likedPosts instead of likedposts
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});




// posts routes

router.get("/category/:category", async function (req, res, next) {
  const category = req.params.category;
  const categoryposts = await postModel.find({
    category: { $in: [category] },
  });
  console.log(categoryposts);

  console.log(category);
  const viewPath = path.join("categories", category);
  if (req.session.passport && req.session.passport.user) {
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    if (user) {
      // console.log(typeof user);
      res.render(viewPath, {
        categoryposts,
        user,
        nav: "userLoggedIn",
        category,
      });
      return;
    }
  }

  res.render(viewPath, { categoryposts, nav: "userNotLoggedIn", category });
});

// router.get("/category/:category/:categorypostid", async function(req,res){
//   const openedcategory = req.params.category;
//   const openedpost = req.params.categorypostid;
//   let userlogged;
//   const currentpost = await postModel.find({_id:openedpost});
//   const posts = await postModel.find({
//       $and :[
//         {_id: {$ne: openedpost}},
//         {category : openedcategory} 
//       ]
//     });
  

//   if (req.session.passport && req.session.passport.user) {
//     const user = await userModel.findOne({
//       username: req.session.passport.user,
//     });
//     userlogged = user;
//     const postliked = await likeModel.findOne({
//       user: user,
//       post: openedpost,
//     });
//     console.log(userlogged); 
//     if (user) {
//       console.log(typeof user);
//       res.render("showpost", { userlogged, currentpost, openedpost, postliked, openedcategory, posts ,user ,  nav: "userLoggedIn" });
//     }
//   }

//   res.render("showpost", { userlogged , currentpost,openedpost, openedcategory,posts , nav: "userNotLoggedIn" });
// });
  
router.get("/category/:category/:categorypostid", async function (req, res) {
  const openedcategory = req.params.category;
  const openedpost = req.params.categorypostid;
  let user;
  let liked;
  let postliked=false;

  if (req.session.passport && req.session.passport.user) {
    const user1 = await userModel.findOne({
      username: req.session.passport.user,
    });
    user = user1;
    liked = await likeModel.findOne({ user: user1, post: openedpost });
    if(liked){
      postliked=true;
    }
    
  }
  // console.log(liked);
  console.log(postliked);
  const currentpost = await postModel.find({ _id: openedpost });
  const posts = await postModel.find({
    $and: [{ _id: { $ne: openedpost } }, { category: openedcategory }],
  });

  res.render("showpost", {
    user,
    currentpost,
    openedpost,
    postliked,
    openedcategory,
    posts,
    nav:
      req.session.passport && req.session.passport.user
        ? "userLoggedIn"
        : "userNotLoggedIn",
  });
});


router.get("/category/:category/:categorypostid/like", isLoggedIn, async function (req, res) {
  likedpostid = req.params.categorypostid;
  const user = await userModel.findOne({ username: req.session.passport.user });
   try{
     const likepst = await likeModel.create({
       post: likedpostid,
       user: user,
     });
     user.likedposts.push(likepst._id);
     await user.save();
     console.log(likepst);
     res.status(200).send("Post added to likes successfully");
   }
   catch(error){
    console.log(error);
    res.status(500).send("Error liking post");
   }
});


router.get(
  "/category/:category/:categorypostid/unlike",
  isLoggedIn,
  async function (req, res) {
    likedpostid = req.params.categorypostid;
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    try {
      const unlikepst = await likeModel.deleteOne({
        post: likedpostid,
        user: user._id,
      });
      

      const index = user.likedposts.indexOf(likedpostid);
      if (index > -1) {
        user.likedposts.splice(index, 1);
      }

      // Save the user
      await user.save();

      console.log(unlikepst);
      res.status(200).send("Post removed from likes successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error liking post");
    }
  }
);


// All Admin Routes

router.get("/admindashboard", isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user,
  });
  const allusers = await userModel.find({});
  const allposts = await postModel.find({});
  const allfeedbacks = await fbrequestModel.find({});
  const alltrainers = await userModel.find({usertype:1});
  res.render('admindashboard', {allusers,allposts,allfeedbacks,alltrainers,user});
});

router.get("/showusers", async function (req, res, next) {
  const allusers = await userModel.find({});
  res.render("showusers", {allusers});
});

router.get("/showfeedbacks", async function (req, res, next) {
  const allfeedbacks = await fbrequestModel.find({});
  res.render("showfeedbacks",{allfeedbacks});
});

router.get("/showtrainers", async function (req, res, next) {
  const alltrainers = await userModel.find({"usertype":1});
  res.render("showtrainers",{alltrainers});
});

router.get("/deletetrainer/:userid", async function(req,res){
  const trainerToDelete = req.params.userid;
  try{
    const deletedtrainer = await userModel.deleteOne({"_id":trainerToDelete});
    res.status(200).send("Trainer Deleted Successfully")
  }
  catch(error){
    console.error("Error Deleting trainer:", error);
    res.status(500).send("Error Deleting trainer");
  }
});

router.get("/showtrainerrequests", async function (req, res, next) {
  const trequests = await userModel.find({
    $and: [{ Experience: { $ne: null } }, { usertype: 0 }],
    });
  console.log(trequests);
  res.render("showtrequests", { trequests });
});

router.get("/acpttrainerrqst/:userid", async function(req,res){
  const userToAccept = req.params.userid;
  try{
    const acceptedUser = await userModel.updateOne(
      {_id:userToAccept},
      { $set : {
        usertype : 1
      }}
    );
    res.status(200).send("Request Accepted Successfully");
  }
  catch(error){
    console.error("Error updating user:", error);
      res.status(500).send("Error Accepting user");
  }
});

router.get("/dlttrainerrqst/:userid", async function(req,res){
  const userIdToUpdate = req.params.userid;
  try{

    const updatedUser = await userModel.updateOne(
      {_id:userIdToUpdate},
      {
        $set: { Experience: null, Expertise: null, Certificate: null },
      }
      );
      
      // console.log(updatedUser);
      res.status(200).send("Request Deleted Successfully.")
    }
    catch(error){
      console.error("Error updating user:", error);
      res.status(500).send("Error updating user");
    }
});

router.get("/showposts/:categories", async function (req, res, next) {
  const postcategory = req.params.categories;
  const posts = await postModel.find({"category":postcategory});
  res.render("showposts",{posts});
});



module.exports = router;
