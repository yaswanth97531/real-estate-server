require("./config/config.js");

const _ = require("lodash");

// import passport setup to bootstrap
const passportSetup = require('./config/passport-setup');
const cookieSession = require('cookie-session');

const express = require("express");
const bodyParser = require("body-parser");
const chokidar = require('chokidar');
const cloudinary = require('cloudinary');
const authRoute = require('./routes/auth-routes');
const postsRoute  = require('./routes/posts-routes');
const keys = require('./config/keys');
const passport = require('passport');


var { authenticate } = require("./middleware/authenticate");
const filepath = './images/';

var app = express();
var port = process.env.PORT;
var cors = require("cors");
app.use(cors());

app.use(bodyParser.json());
// app.use(cookieSession)({
//   maxAge: 24 * 60 *60 * 1000,
//   keys: [keys.session.cookieKey]
// });

// initialize passport 
app.use(passport.initialize());
app.use(passport.session());


app.use('/auth', authRoute);
app.use('/posts', postsRoute);


let watcher = chokidar.watch(filepath, {
  ignored: /[\/\\]\./,
  persistent: true
});

let log = console.log.bind(console);
let scanComplete = false;
cloudinary.config({
  cloud_name: keys.cloudinary.cloud_name,
  api_key: keys.cloudinary.api_key,
  api_secret: keys.cloudinary.api_secret
});

watcher
  .on('add', function (path) {
    if (scanComplete) {
     //add image uploading code here
     let pathArray = path.split('/');
      if (!pathArray[pathArray.length - 1].includes("crdownload")) {
        log('File', path, 'has been added');
        // console.log(pathArray.length, pathArray[pathArray.length - 2]);
        let destfolder = pathArray[pathArray.length - 2];
        let destfileName = pathArray[pathArray.length - 1];
        cloudinary.v2.uploader.upload(path, {
          folder: destfolder,
          use_filename:true,
          tags:[destfolder]
        }, function (error, result) {
          if (error) {
            console.log("error ocurred", error);
          }
          else {
            console.log("result of upload \n", result.secure_url,"\n insecure url: \n",result.url);
          }
        });
      }   
   }
  })
  .on('addDir', function (path) {
    // log('Directory', path, 'has been added'); 
  })
  .on('error', function (error) { log('Error happened', error); })
  .on('ready', function () {
    log('Initial scan complete. Ready for changes.');
    scanComplete = true;
  })
  .on('raw', function (event, path, details) {
    // log('Raw event info:', event, path, details);
  })


// app.get('/users/me', authenticate, (req, res) => {
//   res.send(req.user);
// });


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = { app };
