const https = require('https');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

/**
 * Preuzimanje slike i čuvanje na lokalnom serveru.
 * @param {string} imageUrl - URL slike koju želimo da preuzmemo.
 * @param {string} savePath - Lokacija na serveru gde će slika biti sačuvana.
 */
async function downloadImage(imageUrl, savePath) {
  const writer = fs.createWriteStream(savePath);

  const response = await axios({
    url: imageUrl,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

module.exports = downloadImage;
