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
// Twlio API: (https://www.twilio.com/console/phone-numbers/PN17fcbf2f99edc2eb05e4e3dbc4ee5d72)
// * url/phonecall
// * url/textmessage

//random emoji for users

//Initilize Server
const path = require('path');
const express = require('express');
const app = express();

const MongoClient = require('mongodb').MongoClient;
// var ObjectId = require('mongodb').ObjectID;

var callbackUrl = 'http://partyqueso.com';

var userCollection;
MongoClient.connect('mongodb+srv://chriswoodle:XEVEUVejMqM8gXCY@stitch-eancs.gcp.mongodb.net/partyqueue', { useNewUrlParser: true }, (err, client) => {
  if (err) console.log(err);
  console.log('Connected to mongodb');
  userCollection = client.db().collection('users');
});

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
  if (req.headers.cookie && req.headers.cookie.includes('owner_id=')) {
    var owner_id = req.headers.cookie.split('owner_id=')[1];
    console.log(owner_id)
    req.owner_id = owner_id;
  }
  if (req.headers.cookie && req.headers.cookie.includes('spotify_id=')) {
    var spotify_id = req.headers.cookie.split('spotify_id=')[1];
    console.log(spotify_id)
  }
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
      spotifyAccount = {
        ...profile,
        accessToken: accessToken,
        refreshToken: refreshToken,
        expires_in: expires_in
      };
      console.log(profile)
      return done(null, profile);
      // User.findOrCreate({ spotifyId: profile.id }, function(err, user) {
      //   return done(err, user);
      // });
    }
  )
);

//Custom routes for Spotify authentication
app.get('/auth/spotify', 
  passport.authenticate('spotify'), function(req, res) {}
);

app.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/host' }),
  function(req, res) {
    if (spotifyAccount) {
      res.spotify = spotifyAccount;
    }
    res.redirect('/spotify');
  }
);

app.get(
  '/spotify',
  function(req, res, next) {
    if (spotifyAccount) {
      userCollection.updateOne({ owner_id: req.owner_id }, { $set: { spotify: spotifyAccount } }, { upsert: true })
      .then(result => {
        next();
      });
    } else {
      res.redirect('/host');
    }
  }
);

//Phone call and text message handlers

/*
{ ToCountry: 'US',
  ToState: 'ND',
  SmsMessageSid: 'SMed281c5a57c04181c08ddeb9cc17cef1',
  NumMedia: '0',
  ToCity: 'HATTON',
  FromZip: '33617',
  SmsSid: 'SMed281c5a57c04181c08ddeb9cc17cef1',
  FromState: 'FL',
  SmsStatus: 'received',
  FromCity: 'TAMPA',
  Body: 'Yo whatup bitch',
  FromCountry: 'US',
  To: '+17015436969',
  ToZip: '58240',
  NumSegments: '1',
  MessageSid: 'SMed281c5a57c04181c08ddeb9cc17cef1',
  AccountSid: 'AC085164ea58ae869dac754fbbd854b82a',
  From: '+18137519621',
  ApiVersion: '2010-04-01' }

{ ToCountry: 'US',
  MediaContentType0: 'image/jpeg',
  ToState: 'ND',
  SmsMessageSid: 'MMa62ef831fe7aa940a7d9b642e999d7f9',
  NumMedia: '1',
  ToCity: 'HATTON',
  FromZip: '33617',
  SmsSid: 'MMa62ef831fe7aa940a7d9b642e999d7f9',
  FromState: 'FL',
  SmsStatus: 'received',
  FromCity: 'TAMPA',
  Body: '',
  FromCountry: 'US',
  To: '+17015436969',
  ToZip: '58240',
  NumSegments: '1',
  MessageSid: 'MMa62ef831fe7aa940a7d9b642e999d7f9',
  AccountSid: 'AC085164ea58ae869dac754fbbd854b82a',
  From: '+18137519621',
  MediaUrl0: 'https://api.twilio.com/2010-04-01/Accounts/AC085164ea58ae869dac754fbbd854b82a/Messages/MMa62ef831fe7aa940a7d9b642e999d7f9/Media/MEaaa9e4fddfef0db59c330628563a39c8',
  ApiVersion: '2010-04-01' }
*/

app.post(
  '/phonecall',
  function(req, res, next) {
    console.log(req.body)
    res.send('OK');
  }
);

app.post(
  '/textmessage',
  function(req, res, next) {
    console.log(req.body)
    res.send('OK');
  }
);

//Custom Middleware
app.use(function (req, res, next) {
  res.sendfile('./build/index.html');
});

const port = process.env.SERVER_PORT || 80;

app.listen(port, () => {
  console.log(`Server is running on port: ` + port);
});
