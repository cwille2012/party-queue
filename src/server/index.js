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
        spotifyUserId: profile.id,
        spotifyAccessToken: accessToken
      };
      return done(null, profile);
    }
  )
);

//Custom routes for Spotify authentication
app.get('/auth/spotify', 
  passport.authenticate('spotify'), function(req, res) {}
);

app.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify', { 
    failureRedirect: '/host',
    scope: [
      'playlist-modify-private',
      'playlist-modify',
      'playlist-modify-public',
      'user-read-email',
      'user-library-read',
      'user-read-private',
      'playlist-read-private'
    ],
    showDialog: true
  }),
  function(req, res) {
    if (spotifyAccount) {
      userCollection.updateOne({ owner_id: req.owner_id }, { $set: { spotifyUserId: spotifyAccount.spotifyUserId, spotifyAccessToken: spotifyAccount.spotifyAccessToken } }, { upsert: true });
    }
    res.redirect('/spotify');
  }
);

app.get(
  '/spotify',
  function(req, res, next) {
    if (spotifyAccount) {
      next();
    } else {
      res.redirect('/host');
    }
  }
);

//Secondary Spotify authentication method
var SpotifyWebApi = require('spotify-web-api-node');

var scopes = ['user-read-private', 'user-read-email', 'playlist-modify-private', 'playlist-modify', 'playlist-read-private'];
var clientId = '5fe01282e44241328a84e7c5cc169165';
var state = 'some-state-of-my-choice';

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
var spotifyApi = new SpotifyWebApi({
  redirectUri: callbackUrl,
  clientId: clientId
});

// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

console.log(authorizeURL);

var authorizationCode = authorizeURL;

var playlistId;

// First retrieve an access token
spotifyApi
  .authorizationCodeGrant(authorizationCode)
  .then(function(data) {
    // Save the access token so that it's used in future requests
    spotifyApi.setAccessToken(data['access_token']);

    // Create a playlist
    return spotifyApi.createPlaylist(
      'thelinmichael',
      'My New Awesome Playlist'
    );
  })
  .then(function(data) {
    console.log('Ok. Playlist created!');
    playlistId = data.body['id'];

    // Add tracks to the playlist
    return spotifyApi.addTracksToPlaylist('thelinmichael', playlistId, [
      'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
      'spotify:track:6tcfwoGcDjxnSc6etAkDRR',
      'spotify:track:4iV5W9uYEdYUVa79Axb7Rh'
    ]);
  })
  .then(function(data) {
    console.log('Ok. Tracks added!');

    // Woops! Made a duplicate. Remove one of the duplicates from the playlist
    return spotifyApi.removeTracksFromPlaylist('thelinmichael', playlistId, [
      {
        uri: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
        positions: [0]
      }
    ]);
  })
  .then(function(data) {
    console.log('Ok. Tracks removed!');

    // Actually, lets just replace all tracks in the playlist with something completely different
    return spotifyApi.replaceTracksInPlaylist('thelinmichael', playlistId, [
      'spotify:track:5Wd2bfQ7wc6GgSa32OmQU3',
      'spotify:track:4r8lRYnoOGdEi6YyI5OC1o',
      'spotify:track:4TZZvblv2yzLIBk2JwJ6Un',
      'spotify:track:2IA4WEsWAYpV9eKkwR2UYv',
      'spotify:track:6hDH3YWFdcUNQjubYztIsG'
    ]);
  })
  .then(function(data) {
    console.log('Ok. Tracks replaced!');
  })
  .catch(function(err) {
    console.log(err.message);
    console.log('Something went wrong!');
  });







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
    //for num of pics
    var textData = {

    };
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
