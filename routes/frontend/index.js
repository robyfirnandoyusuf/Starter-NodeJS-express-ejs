var express = require('express')
var app = express()
var base_url = require('./base_url.js')

app.get('/', function(req, res) {
   	var arrDet = [];
   	req.getConnection(function(error, conn) {
	       	conn.query('SELECT project.*,detail_project.* FROM project LEFT JOIN detail_project ON project.id = detail_project.parent_id',function(err, rows, fields) {
            /*if (rows.length <= 0) {
                req.flash('error', 'User not found with id = ' + req.params.id)
                res.redirect('/backend/users')
            }
            else {
            	details.push(rows);
            }   */  

            rows.forEach(function(detail){
            	arrDet.push({
            		project_name  	: detail.project_name,
            		task 			: detail.task
            	});
            });

            console.log(arrDet);
        })
    })
	//data project
	req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM project',function(err, rows, fields) {
        	/*data_project.forEach(function(project){
	        	conn.query('SELECT project.*,detail_project.* FROM project LEFT JOIN detail_project ON project.id = detail_project.parent_id',function(err, rows_detail, fields) {
		            if (err) {
		                req.flash('error', err)
		            	console.log(err);
		                res.render('index_frontend', {
		                    title: 'Project List', 
		                    data: ''
		                })
		            } else {
			            	console.log(rows);
		            	 res.render('index_frontend', {
		                    title: 'Project List', 
		                    data_project: rows,
		                    data_detail: rows_detail,
		                    base_url:base_url.public
		                })

		            }
	        	});
	        });*/
	        if (err) {
	            req.flash('error', err)
            	console.log(err);
                res.render('index_frontend', {
                    title: 'Project List', 
                    data: ''
                })
            } else {
            	 res.render('index_frontend', {
                    title: 'Project List', 
                    data_project: rows,
                    arr_detail : arrDet,
                    base_url:base_url.public
                })

            }
        })
    })

	
    // render to views/index.ejs template file
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