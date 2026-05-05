import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";

const router = Router();

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || ".jpg");
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

router.post(
  "/image",
  authMiddleware,
  requireRole("ADMIN", "VENDOR"),
  upload.single("image"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Image file is required" });
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    return res.json({ imageUrl, filename: req.file.filename });
  }
);

export default router;
