const Url = require("../models/Url");
require("dotenv").config();
const { generateShortCode } = require("../utils/urlShortener");

exports.createShortUrl = async (req, res) => {
  try {
    const { longUrl } = req.body;
    const userId = req.user._id;

    // Check if URL already exists
    let existingUrl = await Url.findOne({ longUrl, user: userId });

    if (existingUrl) {
      // If the URL return the existing URL
      return res.status(200).json({
        message: "Your URL is already shortened",
        shortUrl: existingUrl.shortUrl,
        shortCode: existingUrl.shortCode,
      });
    }

    // If the URL does not exist, generate a new short URL
    const shortCode = generateShortCode();
    const shortUrl = `https://tinyfy.vercel.app/${shortCode}`;

    // Create a new url
    const url = new Url({
      longUrl,
      shortUrl,
      shortCode,
      user: userId,
    });

    await url.save();

    res.status(201).json({
      message: "Your shortened URL is ready!",
      shortUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating short URL" });
  }
};

exports.getUserUrls = async (req, res) => {
  try {
    const userId = req.user._id;
    const urls = await Url.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(urls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user URLs" });
  }
};

exports.deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const url = await Url.findOneAndDelete({ _id: id, user: userId });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    res.status(200).json({ message: "URL deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting URL" });
  }
};

exports.redirectToLongUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    url.clicks += 1;
    await url.save();

    // Send the long URL in the response
    res.status(200).json({
      longUrl: url.longUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "Error redirecting to long URL" });
  }
};
