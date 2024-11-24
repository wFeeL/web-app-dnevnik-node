const express = require('express');
const http = require("http");
const fs = require("fs");
const session = require('express-session');
const index = require('./routes/index.js');
const login = require('./routes/login.js');
const {join} = require("node:path");

const app = express();
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.set('port', 8000);
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');
app.get('/', index.index);
app.get('/login', login.login);


http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
