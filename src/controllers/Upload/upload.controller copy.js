const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cấu hình Cloudinary với API key và secret của bạn
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cấu hình multer để lưu ảnh lên Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'your-folder-name', // Thư mục chứa ảnh trên Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Các định dạng ảnh cho phép
    }
});

// Cấu hình multer sử dụng Cloudinary
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Giới hạn kích thước file là 10MB
    }
});

// Tạo endpoint upload file lên Cloudinary
const uploadFilee = (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded. Vui lòng chọn file để upload.' });
        }

        // Lấy URL của ảnh trên Cloudinary
        const fileUrl = req.file.secure_url;  // Cloudinary trả về URL ảnh đã upload
        res.json({ url: fileUrl, typee: "ImageChinh" });
    });
};

// Endpoint upload nhiều ảnh lên Cloudinary
const uploadFiles = (req, res) => {
    upload.array('files', 12)(req, res, (err) => {  // 'files' là tên trường trong form gửi lên
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded. Vui lòng chọn file để upload.' });
        }

        // Lấy URL cho mỗi file và trả về
        const fileUrls = req.files.map((file, index) => {
            const fileUrl = file.secure_url; // URL từ Cloudinary
            return {
                url: fileUrl,
                typee: 'ImageSlider'  // Ảnh đầu tiên là chính, còn lại là slider
            };
        });

        res.json(fileUrls);  // Trả về mảng các URL và loại ảnh
    });
};

module.exports = {
    uploadFilee, uploadFiles,
};
