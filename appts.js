module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getDoctors(res, mysql, context, complete){
        mysql.pool.query("SELECT doctor_id as id FROM dc_doctor", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.doctors  = results;
            complete();
        });
    }

    ///mysql.pool.query("SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id", function(error, results, fields)

    function getAppts(res, mysql, context, complete){
        mysql.pool.query("SELECT dc_appt.appt_id as id, appt_date, patient_id, doctor_id, assist_id, appt_reason, appt_result, next_appt_date, bill_id FROM dc_appt", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.appts = results;
            complete();
        });
    }
    
    /* displays one appointment for editing purposes */
    function getAppt(res, mysql, context, id, complete){
        var sql = "SELECT appt_id as id, patient_id, doctor_id FROM dc_appt WHERE appt_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.person = results[0];
            complete();
        });
    }
    

    /*Display all appointments. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteappt.js","filterappts.js","searchappts.js"];
        var mysql = req.app.get('mysql');
        getAppts(res, mysql, context, complete);
        getDoctors(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('appts', context);
            }

        }
    });

    /* Display one appointment for the specific purpose of updating appointments */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selecteddoctor.js", "updateappt.js"];
        var mysql = req.app.get('mysql');
        getAppt(res, mysql, context, req.params.id, complete);
        getDoctors(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-appt', context);
            }

        }
    });
    
    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE dc_appt SET patient_id=?, doctor_id=? WHERE appt_id=?";
        var inserts = [req.body.patient_id, req.body.doctor_id, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /*lists appointment by doctor*/
    
    function getApptsbyDoctor(req, res, mysql, context, complete){
        var query = "SELECT dc_appt.appt_id as id, patient_id, dc_doctor.name AS doctor_id FROM dc_appt INNER JOIN dc_doctor ON doctor_id = dc_doctor.doctor_id WHERE dc_appt.doctor_id = ?";
        console.log(req.params)
        var inserts = [req.params.doctor]
        mysql.pool.query(query, inserts, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.appt = results;
              complete();
          });
      }

    /*Display all appointments from a given doctor. Requires web based javascript to delete users with AJAX*/
    router.get('/filter/:doctor', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
        getApptsbyDoctor(req,res, mysql, context, complete);
        getDoctors(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('appts', context);
            }

        }
    });

        /* Adds an appointment, redirects to the appointments page after adding */

        router.post('/', function(req, res){
            console.log(req.body.doctor_id)
            console.log(req.body)
            var mysql = req.app.get('mysql');
            var sql = "INSERT INTO dc_appt (appt_date, patient_id, doctor_id, assist_id, appt_reason, appt_result, next_appt_date, bill_id) VALUES (?,?,?,?,?,?,?,?)";
            var inserts = [req.body.appt_date, req.body.patient_id, req.body.doctor_id, req.body.assist_id, req.body.appt_reason, req.body.appt_result, req.body.next_appt_date, req.body.bill_id];
            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                if(error){
                    console.log(JSON.stringify(error))
                    res.write(JSON.stringify(error));
                    res.end();
                }else{
                    res.redirect('/appts');
                }
            });
        });

    return router;
}();
