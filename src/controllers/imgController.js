const express = require("express");
const sharp = require("sharp");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const fetch = require('node-fetch');

exports.generateThumbNail = async (req, res, next) => {
    console.log(req.body.url);
    try {
      const response = await axios.get(req.body.url, { responseType: "arraybuffer" });
      const buffer = Buffer.from(response.data, "binary");
      try {
        const resizedImage = await sharp(buffer)
          .resize(50, 50)
          .jpeg({ quality: 50 })
          .toBuffer();
        res.set("Content-Type", "image/jpeg");
        res.send(resizedImage);
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  };