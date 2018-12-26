var express = require('express')
var app = express()
var base_url = require('./base_url.js')
 
app.get('/', function(req, res) {
    // render to views/index.ejs template file
    res.render('index', {title: 'Starter NodeJS', base_url:base_url.public})
})
 
/** 
 * We assign app object to module.exports
 * 
 * module.exports exposes the app object as a module
 * 
 * module.exports should be used to return the object 
 * when this file is required in another module like app.js
 */ 
module.exports = app;