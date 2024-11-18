const { ObjectId } = require('mongodb'); // To import MongoDb Objects, to match objects by their MongoDB object _ID

module.exports = function (app, passport, db) {
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });
  // HOME SECTION ===========================
  app.get("/home", isLoggedIn, function (req, res) {
    db.collection("chartedSongs")
      .find()
      .sort({ thumbUp: -1 })
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("home.ejs", {
          user: req.user, //not sure if this right, is this for passport or something else?
          chartedSongs: result,
        });
      });
  });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, function (req, res) {
    db.collection("users")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("profile.ejs", {
          user: req.user,
          users: result,
        });
      });
  });

  // LOGOUT ==============================
  app.get("/logout", function (req, res) {
    req.logout(() => {
      console.log("User has logged out!");
    });
    res.redirect("/");
  });

  // message board routes ===============================================================
  //saves newly created message into the chartedSongs collection on mongo
  app.post("/chartedSongs", (req, res) => {
    db.collection("chartedSongs").save(
      {
        email: req.body.email,
        artistName: req.body.artistName,
        songTitle: req.body.songTitle,
        thumbUp: 0,
        thumbDown: 0,
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/home");
      }
    );
  });

  app.put("/chartedSongs", (req, res) => {
    const { postId, thumbUp, thumbDown } = req.body;
  
    // Determine the field to update
    const updateField = thumbUp !== undefined ? { thumbUp } : { thumbDown };
  
    db.collection("chartedSongs").findOneAndUpdate(
      { _id: ObjectId(postId) }, // Match by _id
      { $set: updateField }, // Update the appropriate field
      { returnOriginal: false }, // Return the updated document
      (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result.value); // Send the updated document back to the client
      }
    );
  });

  app.delete("/chartedSongs", (req, res) => {
    const { postId } = req.body;
  
    db.collection("chartedSongs").findOneAndDelete(
      { _id: ObjectId(postId) }, // Match by _id thats in MongoDB
      (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Entry deleted!");
      }
    );
  });

  // uses radio statio API to display a random radio station!

  const RadioBrowser = require("radio-browser");

  app.get("/random-station", (req, res) => {
    RadioBrowser.getStations({
      limit: 1,
      offset: Math.floor(Math.random() * 1000),
      order: "random",
    })
      .then((stations) => {
        if (stations.length) {
          res.json(stations[0]); // Send the first station's details
        } else {
          res.status(404).send("No stations found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error fetching radio station");
      });
  });
  
  app.post('/vote-station', (req, res) => {
    const stationId = req.body.stationId;

    RadioBrowser.voteStation(stationId)
        .then(response => {
            res.status(200).send('Vote registered');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error voting for the station');
        });
});


  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/home", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/home", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      // saves new user document into the user collection in mongo
      res.redirect("/profile");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
