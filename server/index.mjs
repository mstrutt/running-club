import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import querystring from 'querystring';
import request from 'request';

import {
  fetch,
  generateRandomString,
  handleError
} from './util.mjs';

dotenv.config();

const port = process.env.PORT || '8888';
const client_id = process.env.STRAVA_CLIENT_ID;
const client_secret = process.env.STRAVA_CLIENT_SECRET;
const redirect_uri = `http://localhost:${port}/callback`; // Your redirect uri
const stateKey = 'strava_auth_state';

const app = express();

app.use(express.static('./dist'))
   .use(cors())
   .use(cookieParser());

app.get('/login', function(req, res) {

  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  const scope = 'read_all,activity:read_all';
  res.redirect('https://www.strava.com/oauth/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://www.strava.com/oauth/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
        client_id: client_id,
        client_secret: client_secret
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token,
            maps_key: process.env.MAP_QUEST_CONSUMER_KEY
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  refreshStravaToken(refresh_token)
    .then(access_token => res.send({ access_token }))
    .catch(handleError(res));
});

app.get('/strava', function(req, res) {
  const { access_token, refresh_token } = req.query;
  const authOptions = {
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };
  Promise.all([
    stravaFetch(`https://strava.com/api/v3/athlete?access_token=${access_token}`, authOptions, refresh_token),
    stravaFetch(`https://strava.com/api/v3/athlete/activities?access_token=${access_token}`, authOptions, refresh_token)
  ]).then(([athlete, activities]) => {
    res.send(JSON.stringify({
      athlete,
      activities
    }));
  })
  .catch(handleError(res));
});

app.get('/strava/:api_path(*)', function(req, res) {
  const { access_token, refresh_token } = req.query;
  const { api_path } = req.params;
  const authOptions = {
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };
  stravaFetch(`https://strava.com/api/v3/${api_path}?access_token=${access_token}`, authOptions, refresh_token)
  .then((club) => {
    res.send(JSON.stringify(club));
  })
  .catch(handleError(res));
});

function refreshStravaToken(refresh_token) {
  console.log('Attempting to refresh token...', refresh_token);
  var authOptions = {
    url: 'https://www.strava.com/oauth/token',
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
      client_id: client_id,
      client_secret: client_secret,
    },
    json: true
  };

  return new Promise((resolve, reject) => {
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200 && body.access_token) {
        console.log(`Refresh successful: ${body.access_token}`)
        resolve(body.access_token);
        return;
      }
      console.log('Refresh attempt failed');
      reject(response);
    });
  });
}

function stravaFetch(url, options={}, refresh_token=null) {
  return fetch(url, options)
    .catch((err) => {
      if (err.statusCode !== 401 || !refresh_token) {
        return Promise.reject(err);
      }

      return refreshStravaToken(refresh_token)
        .then((access_token) => {
          const newUrl = url.replace(/access_token=[^&]+/, `access_token=${access_token}`);
          const newHeaders = {
            ...options.headers,
            'Authorization': `Bearer ${access_token}`
          };
          return fetch(newUrl, {
            ...options,
            headers: newHeaders
          });
        });
    });
}

console.log(`Listening on ${port}`);
app.listen(port);
