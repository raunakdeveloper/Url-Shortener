const User = require("../models/User");
const Url = require("../models/Url");

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const urlCount = await Url.countDocuments({ user: userId });

    res.status(200).json({ user, urlCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
};
