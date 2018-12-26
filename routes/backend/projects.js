var express = require('express')
var app = express()
var base_url = require('./base_url.js')
 
// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM project ORDER BY id DESC',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('backend/projects/list', {
                    title: 'Project List', 
                    data: ''
                })
            } else {
                // render to views/user/list.ejs template file
                res.render('backend/projects/list', {
                    title: 'Project List', 
                    data: rows,
                    base_url:base_url.public

                })
            }
        })
    })
})
 
// SHOW ADD USER FORM
app.get('/add', function(req, res, next){    
    // render to views/user/add.ejs
    res.render('backend/projects/add', {
        title: 'Add New Project',
        name: ''
    })
})
 
// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){    
    req.assert('project_name', 'Project Name is required').notEmpty()  //Validate name
 
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        // var m = moment().format("YYYY-MM-DD h:mm:ss");
        var dateTime = require('node-datetime');
        var dt = dateTime.create();
        var formatted = dt.format('Y-m-d H:M:S');

        var project = {
            project_name: req.sanitize('project_name').escape().trim(),
            created_at:formatted,
        }
        
        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO project SET ?', project, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/user/add.ejs
                    res.render('backend/projects/add', {
                        title: 'Add New Project',
                        name: project.project_name,
                    })
                } else {                
                    req.flash('success', 'Data added successfully!')
                    
                    // render to views/user/add.ejs
                    res.render('backend/projects/add', {
                        title: 'Add New Project',
                        name: ''
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('backend/projects/add', { 
            title: 'Add New Projects',
            project_name: req.body.project_name,
        })
    }
})
 
// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM project WHERE id = ' + req.params.id, function(err, rows, fields) {
            if(err) throw err
            
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'Project not found with id = ' + req.params.id)
                res.redirect('/backend/projects')
            }
            else { // if user found
                // render to views/user/edit.ejs template file
                res.render('backend/projects/edit', {
                    title: 'Edit Project', 
                    //data: rows[0],
                    id: rows[0].id,
                    project_name: rows[0].project_name
                })
            }            
        })
    })
})
 
// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
    req.assert('project_name', 'project Name is required').notEmpty()           //Validate name
 
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.username = '   a user    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('username').trim(); // returns 'a user'
        ********************************************/
        var project = {
            project_name: req.sanitize('project_name').escape().trim(),
        }
        
        req.getConnection(function(error, conn) {
            conn.query('UPDATE project SET ? WHERE id = ' + req.params.id, project, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/user/add.ejs
                    res.render('backend/projects/edit', {
                        title: 'Edit Project',
                        id: req.params.id,
                        project_name: req.body.project_name,
                    })
                } else {
                    req.flash('success', 'Data updated successfully!')
                    
                    // render to views/user/add.ejs
                    res.render('backend/projects/edit', {
                        title: 'Edit User',
                        id: req.params.id,
                        project_name: req.body.project_name,
                        base_url:base_url.public
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('backend/projects/edit', { 
            title: 'Edit User',            
            id: req.params.id, 
            project_name: req.body.project_name,
        })
    }
})
 
// DELETE USER
var project_name;
app.delete('/delete/(:id)', function(req, res, next) {
    var project = { id: req.params.id }
     req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM project WHERE id = ' + req.params.id, function(err, rows, fields) {

            if (rows.length <= 0) {
                req.flash('error', 'Project not found with id = ' + req.params.id)
                res.redirect('/backend/projects')
            }
            else { // if user found
               project_name = rows[0].project_name
            }      
        })
    })

    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM project WHERE id = ' + req.params.id, project, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to project list page
                res.redirect('/backend/projects')
            } else {
                req.flash('success', 'User '+project_name+' deleted successfully!')
                // redirect to project list page
                res.redirect('/backend/projects')
            }
        })
    })
})
 
module.exports = app