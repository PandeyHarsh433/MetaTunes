import mongoose from "mongoose";
import Artist from "../models/newartist.js";
import song from "../models/song.js";
import User from "../models/user.js";
import playlist from "../models/playlist.js";

export const Addsong = async (req, res) => {
  try {
    const body = req.body;
    let artistId = [];
    console.log(body);
    for (var i = 0; i < body.Artist.length; i++) {
      let artists = await Artist.findOne({ name: body.Artist[i] });
      if (artists) {
        artistId.push(artists._id);
      }
    }
    const newsong = new song({
      name: body.name,
      imageURL: body.imageURL,
      songURL: body.songURL,
      Artist: body.Artist,
      language: body.language,
      artistId: artistId,
      like: false,
      totallikes: 0,
      totalstream: 0,
    });
    await newsong.save();
    return res.status(200).send({ response: newsong });
  } catch (eer) {
    console.log(eer);
    return res.status(404).send({ error: eer });
  }
};

export const getallartist = async (req, res) => {
  try {
    const artists = await Artist.find({});
    console.log("heryyy");
    return res.status(200).send({ response: artists });
  } catch (err) {
    console.log(err);
    return res.status(404).send({ error: err });
  }
};

export const commonplaylist = async (req, res) => {
  try {
    const playlists = await playlist.find({ Type: false });
    console.log("heryyy");
    return res.status(200).send({ response: playlists });
  } catch (err) {
    console.log(err);
    return res.status(404).send({ error: err });
  }
};

export const getartist = async (req, res) => {
  try {
    // console.log(req.params);
    const { id } = req.params;
    const artistId = new mongoose.Types.ObjectId(id);
    console.log(artistId);

    const getartist = await Artist.findOne({ _id: artistId });
    const { username } = req.body;
    let songs = [];
    console.log(username);
    if (!username) {
      songs = await song.find({ artistId: { $in: id } });
      for (var k = 0; k < songs.length; k++) {
        songs[k].like = false;
      }
    } else {
      const user = await User.findOne({ username: username });
      songs = await song.find({ artistId: { $in: id } });
      if (user.favourites.length !== 0) {
        for (var i = 0; i < user.favourites.length; i++) {
          for (var j = 0; j < songs.length; j++) {
            if (user.favourites[i].equals(songs[j]._id)) {
              songs[j].like = true;
              console.log("heeey");
            }
          }
        }
      } else {
        songs = await song.find({ artistId: { $in: id } });
        for (var k = 0; k < songs.length; k++) {
          songs[k].like = false;
        }
      }
    }
    const artiste = {
      Artist: getartist,
      songs: songs,
    };
    console.log(artiste);
    return res.status(200).send({ response: artiste });
  } catch (err) {
    console.log(err);
    return res.status(404).send({ error: err });
  }
};

export const getallsong = async (req, res) => {
  try {
    console.log(req.body);
    const { username } = req.body;
    let songs = [];
    console.log(username);
    if (!username) {
      songs = await song.find({});
      for (var k = 0; k < songs.length; k++) {
        songs[k].like = false;
      }
    } else {
      const user = await User.findOne({ username: username });
      songs = await song.find({});
      if (user.favourites.length !== 0) {
        for (var i = 0; i < user.favourites.length; i++) {
          for (var j = 0; j < songs.length; j++) {
            if (user.favourites[i].equals(songs[j]._id)) {
              songs[j].like = true;
              console.log("heeey");
            }
          }
        }
      } else {
        songs = await song.find({});
        for (var k = 0; k < songs.length; k++) {
          songs[k].like = false;
        }
      }
    }
    console.log("nuhvbkeuvnkesvv");
    return res.status(200).send({ response: songs });
  } catch (err) {
    console.log(err);
    return res.status(404).send({ error: err });
  }
};

export const getplaylist = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const playlisty = await playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json({ playlisty });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getallthree = async (req, res) => {
  try {
    console.log("nkjdfvnerjv");
    const songs = await song.find({});
    const artistey = await Artist.find({});
    const playlistey = await playlist.find({ Type: false });
    const obj = {
      songs: songs,
      artists: artistey,
      playlists: playlistey,
    };
    return res.status(200).send({ response: obj });
  } catch {
    console.log(err);
    return res.status(404).send({ error: err });
  }
};

export const categories = async (req, res) => {
  try {
    const { id } = req.params;
    const songs = await song.find({ language: id });
    const artistey = await Artist.find({ language: id });
    const playlistey = await playlist.find({ Type: false, language: id });
    const obj = {
      song: songs,
      Artist: artistey,
      playlist: playlistey,
    };
    return res.status(200).send({ response: obj });
  } catch {
    console.log(err);
    return res.status(404).send({ error: err });
  }
};
