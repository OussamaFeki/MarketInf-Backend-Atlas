const route = require("express").Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
var contr = require("../controle/inf_controle");
var newman = require("../controle/newman_controle");
var Newman = require("../models/Newman");
var modinfluencer = require("../models/influencers");
const upload = require("../upload/upimg");
var profit_contro=require('../controle/profit_contro')
require("dotenv").config();
const { facebook } = require("../config/config");
passport = require("passport");
var fbsdk = require("facebook-sdk");
var fb = new fbsdk.Facebook({
  appId: facebook.client_id,
  secret: facebook.client_secret,
});
const FacebookStrategy = require("passport-facebook").Strategy;
var privatekey = process.env.PRIVATE_KEY;
verifytoken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    res.status(400).json({ msg: "access rejected ...!!!" });
  }
  try {
    let verif = jwt.verify(token, privatekey);
    next();
  } catch (e) {
    res.status(400).json({ msg: e });
  }
};
var secretKey = process.env.SECRET_KEY;
var clientkey = process.env.CLIENT_KEY;
verifySecretclient = (req, res, next) => {
  let sk = req.params.secret;
  let ck = req.params.client;
  if (sk == secretKey && ck == clientkey) {
    next();
  } else {
    res
      .status(400)
      .json({
        error:
          "you can't access to tis route without secret key and client key",
      });
  }
};
passport.use(
  new FacebookStrategy(
    {
      clientID: facebook.client_id,
      clientSecret: facebook.client_secret,
      callbackURL: facebook.call_back,
    },
    function (accessToken, refreshToken, profile, done) {
      //   contr.postfbinf(profile)
      //   .then(doc=>{done(null,doc)})
      //   .catch(err=>done(err))
      modinfluencer.findOne({ facebookId: profile.id }, (err, doc) => {
        if (err) {
          return done(err);
        }
        if (doc) {
          return done(null, doc);
        } else {
          // if there is no user found with that facebook id, create them
          var newinfluencer = new modinfluencer();
          newinfluencer.facebookId = profile.id;
          newinfluencer.accesstoken = accessToken;
          newinfluencer.fullname = profile.displayName;
          newinfluencer.save((err, doc) => {
            if (err) {
              throw err;
            } else {
              let boite = new Newman({
                id_inf: doc._id,
              });
              boite.save((err, succ) => {
                if (err) {
                  return done(err);
                } else {
                  return done(null, doc);
                }
              });
            }
          });
        }
      });
    }
  )
);
passport.serializeUser((user, done) => {
  token = jwt.sign(
    {
      fullname: user.fullname,
      id: user._id,
      role: "influencer",
    },
    privatekey,
    { expiresIn: "10d" }
  );
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  influencer.findById(id).then((user) => {
    done(null, user);
  });
});
// inscription pf influencer
route.post(
  "/addinf",
  [
    check("fullname", "full name is required").notEmpty(),
    check("email", "email is required").notEmpty(),
    check("email", "this is not email").isEmail(),
    check(
      "password",
      "The password must be 4+ chars long and contain a number "
    ).isLength({ min: 4 }),
    check("repass").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("password and confirm-password not matched");
      }
      return true;
    }),
  ],
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      var validationMassages = [];
      validationMassages.push(error.errors[0].msg);
    } else {
      var validationMassages = null;
    }
    contr
      .postNewInf(
        req.body.fullname,
        req.body.email,
        req.body.password,
        req.body.repass,
        validationMassages
      )
      .then((doc) => {
        res.status(200).json({ doc, msg: "added !!" });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
);
//for manager or Admin (search)
route.get("/influencers", (req, res, next) => {
  // let token=req.headers.authorization
  // let user=jwt.decode(token,{complete:true})
  contr
    .getall()
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});
route.get("/research", (req, res, next) => {
  contr
    .search(req.query.fullname)
    .then((doc) => res.status(200).json(doc))
    .catch((err) => res.status(400).json(err));
});
//profile 
route.get("/influencer/:id", upload.single("image"), (req, res, next) => {
  contr
    .getinfbyid(req.params.id)
    .then((doc) => res.status(200).json(doc))
    .catch((err) => res.status(400).json(err));
});
//login of influencer 
route.post("/login", (req, res, next) => {
  contr
    .login(req.body.email,req.body.pass)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});
//for Admin
route.delete("/delete/:id", (req, res, next) => {
  contr
    .deleteinf(req.params.id)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});
route.delete("/dellistnewman/:id_inf", (req, res, next) => {
  newman
    .removelistnewman(req.params.id_inf)
    .then((doc) => res.status(200).json(doc))
    .catch((err) => res.status(400).json(err));
});
//for influencer 
route.patch("/updateinf/:id", verifytoken, (req, res, next) => {
  contr
    .editinf(
      req.params.id,
      req.body.fullname,
      req.body.email,
      req.body.password
    )
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});
route.get("/newman/:id_man", (req, res, next) => {
  newman
    .getallinvit(req.params.id_man)
    .then((doc) =>
      res.status(200).json({ doc: doc.managers, notif: doc.notification })
    );
});
route.put("/configinf/:id", (req, res, next) => {
  contr
    .changepassword(req.params.id, req.body.oldpass, req.body.newpass)
    .then((doc) => res.status(200).json(doc))
    .catch((err) => res.status(400).json(err));
});
route.get("/mansofinf/:id", (req, res, next) => {
  contr
    .getmanofinf(req.params.id)
    .then((doc) => res.status(200).json(doc))
    .catch((err) => res.status(400).json(err));
});

route.put("/upavatarofinf/:id", upload.single("image"), (req, res, next) => {
  contr
    .upavatar(req.params.id, req.file)
    .then((doc) => res.status(200).json(doc));
});
// login with facebook for influencer 
route.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: "email,user_likes,user_posts,user_photos,user_friends",
  })
);

route.get(
  "/auth/facebook/callback",
  function (req, res, next) {
    var authenticator = passport.authenticate("facebook", {
      failureRedirect: "http://localhost:4200/login",
      enableProof: true,
    });
    authenticator(req, res, next);
  },
  (req, res) => {
    return res.redirect("http://localhost:4200/prof/?token=" + token);
  }
);


//collaboration between manager and influencer
route.get("/refuseman", (req, res, next) => {
  var io = req.app.get("socketio");
  newman.removemanfromnewman(req.query.inf_id, req.query.man_id).then((doc) => {
    res.status(200).json(doc);
    io.emit(`datainf ${doc.id_inf}`, doc.managers);
    if (doc.notification > 0) {
      Newman.findOneAndUpdate(
        { id_inf: doc.id_inf },
        { $inc: { notification: -1 } }
      ).then((res) => {
        console.log(res);
        io.emit(`notif ${doc.id_inf}`, doc.notification - 1);
      });
    }
  });
});
route.get("/addnewman", (req, res, next) => {
  var io = req.app.get("socketio");
  newman.addmantonewman(req.query.id, req.query.manid).then((doc) => {
    res.status(200).json(doc);
    Newman.updateOne(
      { id_inf: doc.id_inf },
      { $inc: { notification: 1 } }
    ).then((res) => {
      Newman.findOne({ id_inf: doc.id_inf })
        .populate("managers", "-influencers -password")
        .then((doc) => {
          io.emit(`datainf ${doc.id_inf}`, doc.managers);
          io.emit(`notif ${doc.id_inf}`, doc.notification);
        });
    });
  });
});
route.get("/newmanid", (req, res, next) => {
  newman
    .finding(req.query.id_inf, req.query.id_man)
    .then((doc) => res.status(200).json(doc))
    .catch((err) => res.status(400).json(err));
});
route.get("/findmanid", (req, res, next) => {
  contr
    .finding(req.query.id_man, req.query.id_inf)
    .then((doc) => res.status(200).json(doc))
    .catch((err) => res.status(400).json(err));
});
route.get("/restnotifinf", (req, res, next) => {
  newman.rest(req.query.id).then((doc) => {
    res.status(200).json(doc);
  });
});
//for profit
route.get('/mytotalprofit',(req,res,next)=>{
  profit_contro.gettotalprofofinf(req.query.id_inf)
  .then(doc=>res.status(200).json(doc))
})
module.exports = route;
