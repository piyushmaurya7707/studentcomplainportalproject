// complainPage/complainController.js
const ComplaintSchema = require("../models/complainPageSchema");

const complainController = async (req, res) => {
  try {
    // For multipart/form-data, fields are in req.body
    const {
      fullName,
      email,
      title,
      type,
      priority = "Medium",
      incidentDate,
      description,
      expectedResolution,
    } = req.body;

    if (!fullName || !email || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const newComplaint = new ComplaintSchema({
      fullName,
      email,
      title,
      type,
      priority,
      incidentDate,
      description,
      expectedResolution,
      userId: req.user.id,
      // TODO: Handle files later (images, videos, documents)
    });

    await newComplaint.save();

    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
    });
  } catch (error) {
    console.error("Complain Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit complaint",
    });
  }
};

module.exports = complainController;







