require("dotenv").config();
const path = require("path");
const express = require("express");
require("./db/conn");
const Detail = require("./models/details");
const hbs = require("hbs");
const cookieparser = require("cookie-parser");
const app = express();
const port = process.env.PORT
const bcrypt = require("bcryptjs");
const statPath = path.join(__dirname, "public");
const templatePath = path.join(__dirname, "templates", "views");
const partialPath = path.join(__dirname, "templates", "partials");
const auth = require("./middleware/auth");
const async = require("hbs/lib/async");
const { body, validationResult } = require("express-validator");

app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialPath);
app.use(express.static(statPath));
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }));

app.get("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((currToken) => {
      return currToken.token !== req.token;
    });
    res.clearCookie("jwt");
    await req.user.save();
    res.render("index");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/", auth, (req, res) => {
  res.render("notes", {
    username: req.user.name,
  });
});
app.get("/getallnotes", auth, (req, res) => {
  res.status(201).json(req.user);
});

//TODOError handling for ivalid details for sign in pass!=cpass and login email and pass!
//creating new user
app.post("/signedin", async (req, res) => {
  try {
    const password = req.body.pass;
    const confirmpass = req.body.confirmpass;
    if (password === confirmpass) {
      const userdetail = new Detail({
        name: req.body.user,
        email: req.body.email,
        password: password,
        confirmpassword: confirmpass,
      });

      const token = await userdetail.generateAuthToken();
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      });
      const Detailed = await userdetail.save();
      await Detailed.save();
      res.status(201).json({ status: "ok" });
    } else {
      throw Error;
    }
  } catch (err) {
    res.status(400).json({ status: false });
  }
});
app.post("/loggedin", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.pass;
    const userDetail = await Detail.findOne({ email });
    const isMatch = await bcrypt.compare(password, userDetail.password);
    if (isMatch) {
      const token = await userDetail.generateAuthToken();
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      });
      res.status(201).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "invalid details" });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post(
  "/create",
  auth,
  body("notes.heading").isLength({
    max: 10,
  }),
  async (req, res) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        // console.log(errors);
        res.status(400).json({
          success: "false",
        });
      } else {
        const title = req.body.ttl;
        const text = req.body.txt;
        const useremail = req.user.email;
        const userDetail = await Detail.findOne({ email: useremail });

        userDetail.notes.push({
          heading: title,
          content: text,
        });
        await userDetail.save();
        res.status(201).json({
          success: "true",
          userDetail,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({
        success: "false",
      });
    }
  }
);

app.post("/delnote", auth, async (req, res) => {
  try {
    // console.log(req.body);}
    const email = req.body.email;
    const userDetail = await Detail.findOne({ email });
    await Detail.updateOne(
      { email: req.body.email },
      { $pull: { notes: { _id: req.body.id } } },
      function (err, model) {}
    );
    res.status(201).json({ status: "ok" });
  } catch (err) {
    console.log(err);
  }
});

app.post("/delAll", auth, async (req, res) => {
  try {
    const useremail = req.user.email;
    const userDetail = await Detail.findOne({ email: useremail });
    userDetail.notes = [];
    await userDetail.save();
    res.status(201).json({ status: "ok" });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

app.listen(port, () => {
  console.log(`connection success at port ${port}`);
});
