import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import cloudinary from '../config/cloudinary.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Convert buffer to base64
        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        const result = await cloudinary.uploader.upload(fileBase64, {
            resource_type: 'auto', // Detects if it's image or video
            folder: 'learnify/courses',
        });

        res.status(200).json({
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
});

export default router;
