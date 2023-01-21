require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bp = require('body-parser')

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

const originalUrls = []

app.post('/api/shorturl', (req, res) => {
  try {
    const url = req.body.url
    const foundIndex = originalUrls.indexOf(url)

    if (!url.includes("https://") && !url.includes("http://")) {
      return res.json({ error: "invalid url" })
    }

    if (foundIndex < 0) {
      originalUrls.push(url)
      return res.json({
        original_url: url,
        short_url: originalUrls.length - 1
      })
    }
    return res.json({
      original_url: url,
      short_url: foundIndex
    })
  } catch (error) {
    console.log('🚀 ~ file: index.js:34 ~ app.post ~ error', error)
  }
})

app.get('/api/shorturl/:short', (req, res) => {
    const shortUrl = req.params.short
    console.log('🚀 ~ file: index.js:62 ~ app.get ~ shortUrl =', shortUrl)
    console.log('🚀 ~ file: index.js:64 ~ app.get ~ shortUrl', originalUrls)
    const originalUrl = originalUrls[shortUrl] 
    console.log(originalUrl)
    return res.redirect(originalUrl)
})