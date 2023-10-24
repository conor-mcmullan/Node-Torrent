// const axios = require('axios');

import axios from 'axios';

const URL = "http://localhost:7777/v1/download"

const EXAMPLE_DATA = {
    display: {
                category: 'TV Show',
                episode: 1,
                name: 'Rick and Morty',
                quality: '720p',
                season: 7,
                series_info: 'S07E01',
    },
    magnet: {
            hash: 'EFD0CA9A28A953BF11C446EE5CBECA0C2F4DE7CC',
            uri: 'magnet:?xt=urn:btih:EFD0CA9A28A953BF11C446EE5CBECA0C2F4DE7CC&dn=Rick.and.Morty.S07E01.720p.WEB.x265-MiNX%5BTGx%5D&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.tiny-vps.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Fexplodie.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce&tr=udp%3A%2F%2Fipv4.tracker.harry.lu%3A80%2Fannounce&tr=udp%3A%2F%2Fp4p.arenabg.com%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.birkenwald.de%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.moeking.me%3A6969%2Fannounce&tr=udp%3A%2F%2Fopentor.org%3A2710%2Fannounce&tr=udp%3A%2F%2Ftracker.dler.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fuploads.gamecoast.net%3A6969%2Fannounce&tr=https%3A%2F%2Ftracker.foreverpirates.co%3A443%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=http%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Fopentracker.i2p.rocks%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fcoppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.zer0day.to%3A1337%2Fannounce',
    },
    trackers: {
                http: [
                        'http://tracker.openbittorrent.com:80/announce'
                ],
                https: [
                        'https://tracker.foreverpirates.co:443/announce'
                ],
                udp: [
                        'udp://open.stealth.si:80/announce',
                        'udp://tracker.tiny-vps.com:6969/announce',
                        'udp://tracker.opentrackr.org:1337/announce',
                        'udp://tracker.torrent.eu.org:451/announce',
                        'udp://explodie.org:6969/announce',
                        'udp://tracker.cyberia.is:6969/announce',
                        'udp://ipv4.tracker.harry.lu:80/announce',
                        'udp://p4p.arenabg.com:1337/announce',
                        'udp://tracker.birkenwald.de:6969/announce',
                        'udp://tracker.moeking.me:6969/announce',
                        'udp://opentor.org:2710/announce',
                        'udp://tracker.dler.org:6969/announce',
                        'udp://uploads.gamecoast.net:6969/announce',
                        'udp://tracker.opentrackr.org:1337/announce',
                        'udp://opentracker.i2p.rocks:6969/announce',
                        'udp://tracker.internetwarriors.net:1337/announce',
                        'udp://tracker.leechers-paradise.org:6969/announce',
                        'udp://coppersurfer.tk:6969/announce',
                        'udp://tracker.zer0day.to:1337/announce',
                ],
    },
};

axios.post(URL, EXAMPLE_DATA).then((response) => {
    console.log('Torrent added successfully:', response.data);
}).catch((error) => {
    console.error('Error adding torrent:', error);
});
