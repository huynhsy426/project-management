const path = require('path');

var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const duoiFile = path.extname(file.originalname).toUpperCase();

        if ([".JPG", ".JPEG", ".PNG", ".GIF"].includes(duoiFile)) {
            cb(null, 'uploads/images/')
            return;
        }
        if ([".MP3", ".WMA", ".WAV", ".FLAC"].includes(duoiFile)) {
            cb(null, 'uploads/audios/')
            return;
        }
        cb(null, 'uploads/files/')
        return;
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({
    storage: storage
});

module.exports = upload;