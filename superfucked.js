// super fucked

import express from 'express';
import WebTorrent from 'webtorrent';
import fs from 'fs';

const app = express();
const port = 7777;

//const client = new WebTorrent();
let client = new WebTorrent();

app.use(express.json());

const torrentData = {}; // Object to store torrent details

// Function to check if a directory exists
function directoryExists(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (err) {
    return false;
  }
}

// On API boot, add tracking data for downloaded torrents
// Mark them as "downloaded" if the folder exists
const downloadsDir = './downloads/';
fs.readdirSync(downloadsDir).forEach((dir) => {
  if (directoryExists(downloadsDir + dir)) {
    torrentData[dir] = {
      name: dir,
      status: 'downloaded',
    };
  }
});

app.post('/v1/download', (req, res) => {
  const { display, magnet, trackers } = req.body;

  // Ensure WebTorrent is ready to accept torrents
  if (!client.ready) {
    return res.status(500).json({ error: 'WebTorrent client not ready' });
  }

  const torrentName = display.torrent_name;

  console.log('Received data:', display);
  console.log(`For: ${torrentName}`);

  if (!magnet || !magnet.uri) {
    return res.status(400).json({ error: 'Invalid magnet URI' });
  }

  const existingTorrent = torrentData[torrentName];
  //console.log(`Existing Torrent Status:\t "${existingTorrent.status}"`);
  console.log(`Existing Torrent Status:\t "${existingTorrent?.status}"`);



  // Checking the existing status of the posted torrent
  if (existingTorrent) {
    if (existingTorrent.status === 'downloaded') {
      return res.status(200).json({ message: `Torrent "${torrentName}" is already downloaded.` });
    } else if (existingTorrent.status === 'downloading') {
      return res.status(200).json({ message: `Torrent "${torrentName}" is already in progress.` });
    }
  } else {
    // Initialize the new torrent with a "pending" status
    torrentData[torrentName] = {
      name: torrentName,
      status: 'pending',
    };
    console.log(`Torrent "${torrentName}" is added to the tracker with a status of "pending".`);
  }


  // Validating status assigned to the current posted torrent
  const downloadPath = './downloads/' + torrentName;
  console.log(`Downloading To:\t "${downloadPath}"`);
  if (directoryExists(downloadPath)) {
    // Assuming it's already downloaded if the directory exists
    torrentData[torrentName] = {
      name: torrentName,
      status: 'downloaded',
    };
    return res.status(200).json({ message: `Torrent "${torrentName}" is already downloaded.` });
  } else {
    // If the directory doesn't exist, update the status
    if (torrentData[torrentName]) {
      torrentData[torrentName].status = 'pending'; 
    }
  }


  // TODO: REMOVE - NEW CLIENT
  client = new WebTorrent();

  const infoHash = magnet.uri.split(':btih:')[1].split('&')[0];
  console.log(`Info Hash:\t${infoHash}`)
  

  // CHECK MANAGED TORRENTS
  console.log(`Client Torrents:\t${client.torrents}`)
  const currentClientTorrentStatus = client.get(infoHash);
  console.log(`Current Client Torrent:\t${currentClientTorrentStatus}`)

  if (currentClientTorrentStatus) {
    return res.status(200).json({ message: `Torrent "${torrentName}" is already in progress.` });
  }

  // ********************************************************************

  // TODO: REMOVE
  const torrent = client.add(magnet.uri, { path: downloadPath });

  // TODO: UNCOMMENT
  //client.add(magnet.uri, { path: downloadPath }, (torrent) => {

    console.log('Setting torrent status to downloading');

    torrentData[torrentName] = {
      name: torrentName,
      status: 'downloading',
    };



    // If the torrent is already done, mark it as downloaded
    torrent.on('done', () => {
      console.log(`Download of "${torrentName}" is complete!`);
      torrentData[torrentName].status = 'downloaded';
    });



    // If there is an error with this torrent, mark it as error
    torrent.on('error', (err) => {
      console.error(`Torrent error: ${err.message}`);
      torrentData[torrentName].status = 'error';
    });

    // // Logic for selecting only video files
    // torrent.on('download', () => {
    //   // Ensure that only video files are selected
    //   torrent.files.forEach((file) => {
    //     if (
    //       file.name.endsWith('.mp4') ||
    //       file.name.endsWith('.mkv') ||
    //       file.name.endsWith('.avi')
    //     ) {
    //       file.select();
    //       console.log(`"${file.name}"`);
    //     } else {
    //       file.deselect();
    //       console.log(`"${file.name}" (deselected)`);
    //     }
    //   });
    // });

    res.status(200).json({ message: 'Torrent added successfully' });

  // TODO: UNCOMMENT
  //});

  // ********************************************************************


  //console.log("AFTER THE CLIENT ADD ")






});











app.get('/v1/progress/:infoHash', (req, res) => {
  const infoHash = req.params.infoHash;
  const torrent = torrentData[infoHash];
  if (torrent) {
    res.json(torrent.status === 'downloaded' ? 'downloaded' : torrent.progress);
  } else {
    res.status(404).json({ error: 'Progress information not found for this torrent' });
  }
});

app.get('/v1/allTorrents', (req, res) => {
  const torrents = Object.values(torrentData).map((torrent) => ({
    name: torrent.name,
    status: torrent.status,
  }));
  res.json(torrents);
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
