const path = require('path');

var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const duoiFile = path.extname(file.originalname).toUpperCase();
        if (duoiFile === ".JPG" || duoiFile === ".JPEG" || duoiFile === ".PNG" || duoiFile === ".GIF") {
            cb(null, 'uploads/images/')
        }
        else if (duoiFile === ".MP3" || duoiFile === ".WMA" || duoiFile === ".WAV" || duoiFile === ".FLAC") {
            cb(null, 'uploads/audios/')
        } else {
            cb(null, 'uploads/files/')
        }

    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({
    storage: storage
});

module.exports = upload;