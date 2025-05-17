const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const tmp = require('tmp');
const ID3Writer = require('node-id3');
const { Music } = require('../models');

// Asegúrate de que ffmpeg esté disponible
ffmpeg.setFfmpegPath('/usr/bin/ffmpeg'); // ajusta según tu sistema

exports.downloadAndServeMusic = async (req, res) => {
  try {
    const UserId = req.auth.id;
    const { url } = req.body;

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'URL de YouTube inválida' });
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const thumbnailUrl = info.videoDetails.thumbnails.pop().url;

    // Crea archivos temporales
    const tempMp3 = tmp.fileSync({ postfix: '.mp3' });
    const tempThumb = tmp.fileSync({ postfix: '.jpg' });

    // Descarga miniatura
    const downloadImage = async (url, dest) => {
      const res = await fetch(url);
      const buffer = await res.arrayBuffer();
      fs.writeFileSync(dest, Buffer.from(buffer));
    };

    await downloadImage(thumbnailUrl, tempThumb.name);

    // Convierte a mp3
    await new Promise((resolve, reject) => {
      ffmpeg(ytdl(url, { quality: 'highestaudio' }))
        .audioBitrate(128)
        .format('mp3')
        .save(tempMp3.name)
        .on('end', resolve)
        .on('error', reject);
    });

    // Inserta metadata y miniatura
    const tags = {
      title,
      artist: info.videoDetails.author.name,
      APIC: tempThumb.name
    };
    ID3Writer.write(tags, tempMp3.name);

    // Guarda en la base de datos
    const music = await Music.create({
      title,
      url,
      format: 'mp3',
      filePath: tempMp3.name,
      UserId
    });

    // Enviar el archivo al cliente
    res.download(tempMp3.name, `${title}.mp3`, (err) => {
      if (err) console.error('Error enviando el archivo:', err);

      // Borra los archivos temporales
      try {
        tempMp3.removeCallback();
        tempThumb.removeCallback();
      } catch (e) {
        console.error('Error borrando archivos temporales:', e);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
