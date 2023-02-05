const express = require("express");
const sharp = require("sharp");
const axios = require("axios");
const fs = require("fs");

exports.generateThumbnail = async (req, res) => {
const { url } = req.body;

// try {
//         console.log(url);
//         const response = await axios.get(url, {responseType: "arraybuffer"});
//         console.log(response);
//         const filePath = "../utils/temp.jpg";
//         fs.writeFileSync("../utils/temp.jpg", new Buffer.from(response.data, "binary"));

//         sharp("../utils/temp.jpg")
//         .resize(50, 50)
//         .toBuffer()
//         .then(data => {
//             res.set("Content-Type", "image/jpeg");
//             res.send(data);
//         })
//         .catch(error => {
//             res.status(500).send({ message: error.message });
//         });
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// };




