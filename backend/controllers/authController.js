const admin = require("firebase-admin");
const User = require("../models/User");
const { generateToken } = require("../config/jwt");

exports.googleSignIn = async (req, res) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = new User({
        firebaseUid: uid,
        email,
        name,
        profilePicture: picture,
      });
      await user.save();
    }

    const token = generateToken(user._id);

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Google Sign In Error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};
