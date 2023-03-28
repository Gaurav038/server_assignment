const express = require("express");
const router = express.Router()
const datas = require('../models/Data')
const multer = require("multer");
const cloudinary = require("cloudinary").v2;


// configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// configure Multer middleware
const upload = multer({ dest: "uploads/" });

router.get('/', async(req, res) => {
  const {word = '' } = req.query;
  try {
      const data = await datas.find({name: { $regex: word, $options: 'i' }})
      res.json(data)
  } catch (error) {
      res.send('Error'+error)
  }
})

router.post('/upload',upload.single("image"), async(req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const product = new datas({
      name: req.body.name,
      image: result.secure_url,
    });

    await product.save();

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }

})


module.exports = router;
