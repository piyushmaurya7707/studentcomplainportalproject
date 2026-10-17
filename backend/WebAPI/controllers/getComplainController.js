
const Complaint = require("../models/complainPageSchema");

const getComplains = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const complains = await Complaint.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      complains: complains || [],
    });
  } catch (error) {
    console.error("Get complaints error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints",
    });
  }
};
 


module.exports = getComplains;