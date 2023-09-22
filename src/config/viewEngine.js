const bodyParser = require('body-parser')
const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");

const configViewEngine = (app, session, dirName) => {

    app.set('view engine', 'ejs');
    app.set('views', 'app/views');

    app.use(express.static(path.join(dirName, 'web/public')));
    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));
    app.use(cookieParser());
    app.use(session({
        secret: 'some secrets',
        saveUninitialized: false
    }))
};

module.exports = configViewEngine;