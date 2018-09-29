// Callback URL needs to be updated:
// index.js (here)
// app.js (/src/browser/app.js)
// Stitch Facebook Auth (https://stitch.mongodb.com/groups/5b97d252d383ad60c1342b56/apps/5b97d3aa0e1190f86be22237/auth/providers/oauth2-facebook)
// * url
// Stitch Google Auth (https://stitch.mongodb.com/groups/5b97d252d383ad60c1342b56/apps/5b97d3aa0e1190f86be22237/auth/providers/oauth2-google)
// * url
// Facebook API settings: (https://developers.facebook.com/apps/274377876504428/fb-login/settings/)
// * url
// * https://stitch.mongodb.com/api/client/v2.0/auth/callback
// Google API Settings: (maybe not this one)
// Spotify API: (https://developer.spotify.com/dashboard/applications/9aa40bea0e1e40f4973294a79434da4b)
// * url
// * url/callback
// * url/auth/spotify/callback

//Initilize Server
const path = require('path');
const express = require('express');
const app = express();

var callbackUrl = 'https://655816e4.ngrok.io';

//Custom Middleware
app.use(function (req, res, next) {
  if (req.url == '/server.js') {
    return res.status(403).send('<h1>403 forbidden</h1>');
  }
  next();
});

//Static Directory Setup
app.use(express.static('build'));
app.use(express.static('build/public'));

//Compression Setup
const compress = require('compression');
app.use(compress());

//Body and Cookie Parser Setup
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//Custom Headers Setup
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

//Spotify Authentication
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
var spotifyAccount = null;
const SpotifyStrategy = require('passport-spotify').Strategy;
var appKey = '9aa40bea0e1e40f4973294a79434da4b';
var appSecret = '8e7e1113a8434baca630c02abb67bb66';

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: appKey,
      clientSecret: appSecret,
      callbackURL: String(callbackUrl+'/auth/spotify/callback')
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      spotifyAccount = profile;
      console.log(profile)
      return done(null, profile);
      // User.findOrCreate({ spotifyId: profile.id }, function(err, user) {
      //   return done(err, user);
      // });
    }
  )
);

//Custom routes for Spotify authentication
app.get('/auth/spotify', passport.authenticate('spotify'), function(req, res) {

});

app.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/host' }),
  function(req, res) {
    res.redirect('/spotify');
  }
);

app.get(
  '/spotify',
  function(req, res) {
    if (spotifyAccount) {
      res.status(200).send(spotifyAccount)
    } else {
      res.redirect('/host');
    }
  }
);

//Custom Middleware
app.use(function (req, res, next) {
  //return res.sendFile(path.join(__dirname, './index.html'));
  res.sendfile('./build/index.html');
});

const port = process.env.PORT || 9600;

app.listen(port, () => {
  console.log(`Server is running on port: ` + port);
});
