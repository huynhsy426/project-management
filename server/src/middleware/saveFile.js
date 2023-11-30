const path = require('path');
let multer = require('multer');
const JwtService = require("../services/JWTService");

let storage = multer.diskStorage({
    destination: function (req, file, cb) {

        const filExtension = path.extname(file.originalname).toUpperCase();

        if ([".JPG", ".JPEG", ".PNG", ".GIF"].includes(filExtension)) {
            cb(null, 'uploads/images/')
            return;
        }
        if ([".MP3", ".WMA", ".WAV", ".FLAC"].includes(filExtension)) {
            cb(null, 'uploads/audios/')
            return;
        }
        // word, pdf, excel
        if ([".DOC", ".DOCM", ".DOCX", ".DOT", ".TXT"].includes(filExtension)) {
            cb(null, 'uploads/files/docs')
            return;
        }
        if ([".XLSM", ".XLSX", ".XLT"].includes(filExtension)) {
            cb(null, 'uploads/files/excels')
            return;
        }
        return;
    },
    filename: function (req, file, cb) {
        const authorization = req.headers['authorization'] || '';
        const token = authorization.split('Bearer ')[1];
        const data = JwtService.verify(token);
        cb(null, Date.now() + '-' + data.userId + '-' + file.originalname);
    }
});

let sendData = multer();

upload = multer({
    limits: {
        fields: 5,
        fieldNameSize: 50, // TODO: Check if this size is enough
        fieldSize: 20000, //TODO: Check if this size is enough
        // TODO: Change this line after compression
        fileSize: 15000000, // 150 KB for a 1080x1080 JPG 90
    },
    fileFilter: (req, file, cb) => {
        const filExtension = path.extname(file.originalname).toUpperCase();
        if (![".JPG", ".JPEG", ".PNG", ".GIF"].includes(filExtension)) {
            return cb(null, true);
        }
        if (![".MP3", ".WMA", ".WAV", ".FLAC"].includes(filExtension)) {
            return cb(null, true);
        }
        // word, pdf, excel, txt
        if ([".DOC", ".DOCM", ".DOCX", ".DOT", ".TXT"].includes(filExtension)) {
            return cb(null, true);
        }
        if ([".XLSM", ".XLSX", ".XLT"].includes(filExtension)) {
            return cb(null, true);
        }
        return cb(new Error('file is not allowed'))
    },
    storage: storage
});

module.exports = {
    upload,
    sendData
};