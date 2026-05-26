const path = require("path");
const supabase = require("../lib/supabase");

const BUCKET = "avatars";

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { buffer, mimetype, originalname } = req.file;
    const ext = path.extname(originalname).toLowerCase() || ".jpg";
    const filePath = `${req.user.id}/${Date.now()}${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, { contentType: mimetype });

    if (error) {
      console.error("Supabase upload error:", error);
      return res.status(500).json({ message: "Failed to upload image to storage" });
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    return res.json({ url: data.publicUrl });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
