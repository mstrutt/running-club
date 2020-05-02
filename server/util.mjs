import request from 'request';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
export function generateRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function fetch(url, options={}) {
  return new Promise((resolve, reject) => {
    request.get({
      url,
      ...options
    }, (error, response) => {
      if (error || response.statusCode >= 400) {
        reject(response);
        return;
      }
      resolve(response.body);
    });
  });
}

export function handleError(res) {
  return (err) => {
    console.log(err);
    res.statusCode = 500;
    res.send(JSON.stringify(err));
  };
}