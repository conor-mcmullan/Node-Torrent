import express from 'express';
import WebTorrent from 'webtorrent';
import fs from 'fs';

const app = express();
const port = 7777;

const client = new WebTorrent();

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

// Function to download only video files from the torrent
function downloadOnlyVideoFiles(torrent) {
  const videoFileTypes = ['.mp4', '.mkv', '.avi', '.mpg', '.mpeg', '.mov', '.wmv', '.flv', '.webm', '.ogv', '.3gp'];

  torrent.files.forEach((file) => {
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (videoFileTypes.includes(fileExtension)) {
      file.select();
    } else {
      file.deselect();
    }
  });
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

  console.log('Received data:', display);

  if (!magnet || !magnet.uri) {
    return res.status(400).json({ error: 'Invalid magnet URI' });
  }

  const existingTorrent = torrentData[display.torrent_name];

  if (existingTorrent) {
    if (existingTorrent.status === 'downloaded') {
      return res.status(200).json({ message: `Torrent "${display.torrent_name}" is already downloaded.` });
    } else {
      return res.status(200).json({ message: `Torrent "${display.torrent_name}" is already in progress.` });
    }
  }

  const downloadPath = './downloads/' + display.torrent_name;
  if (directoryExists(downloadPath)) {
    // Assuming it's already downloaded if the directory exists
    torrentData[display.torrent_name] = {
      name: display.torrent_name,
      status: 'downloaded',
    };
    return res.status(200).json({ message: `Torrent "${display.torrent_name}" is already downloaded.` });
  }

  const torrent = client.add(magnet.uri, { path: downloadPath }, (torrent) => {
    torrentData[display.torrent_name] = {
      name: display.torrent_name,
      status: 'downloading',
    };

    // Download only video files
    downloadOnlyVideoFiles(torrent);

    torrent.on('done', () => {
      console.log(`Download of "${display.torrent_name}" is complete!`);
      torrentData[display.torrent_name].status = 'downloaded';
    });

    torrent.on('error', (err) => {
      console.error(`Torrent error: ${err.message}`);
      torrentData[display.torrent_name].status = 'error';
    });

    res.status(200).json({ message: 'Torrent added successfully' });
  });
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
