//const express = require('express');
//const WebTorrent = require('webtorrent');

import express from 'express';
import WebTorrent from 'webtorrent';

const app = express();
const port = 7777;

const client = new WebTorrent();

app.use(express.json());

// Store torrent progress information
const torrentProgress = {};

// Define the API endpoint to add a torrent
app.post('/v1/download', (req, res) => {
  const { display, magnet, trackers } = req.body;

  console.log('Received data:', display);

  if (!magnet || !magnet.uri) {
    return res.status(400).json({ error: 'Invalid magnet URI' });
  }

  // client.add(magnet.uri, { path: './downloads' }, (torrent) => {
  //   // Store progress information for this torrent
  //   torrentProgress[torrent.infoHash] = { downloaded: 0, length: torrent.length };

  //   // Handle torrent events and update progress
  //   torrent.on('download', (bytes) => {
  //     torrentProgress[torrent.infoHash].downloaded = bytes;
  //   });

  //   torrent.on('done', () => {
  //     console.log(`Download of "${torrent.name}" is complete!`);
  //     delete torrentProgress[torrent.infoHash]; // Remove progress info for completed torrents
  //   });

  //   torrent.on('error', (err) => {
  //     console.error(`Torrent error: ${err.message}`);
  //     delete torrentProgress[torrent.infoHash]; // Remove progress info for errored torrents
  //   });

  //   res.status(200).json({ message: 'Torrent added successfully' });
  // });


});

// Define an API endpoint to get progress information
app.get('/v1/progress/:infoHash', (req, res) => {
  const infoHash = req.params.infoHash;
  const progress = torrentProgress[infoHash];
  if (progress) {
    res.json(progress);
  } else {
    res.status(404).json({ error: 'Progress information not found for this torrent' });
  }
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
