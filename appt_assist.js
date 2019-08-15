module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /* get people to populate in dropdown */
    function getAssistants(res, mysql, context, complete){
        mysql.pool.query("SELECT assist_id AS aid, assist_name FROM dc_dentAssist", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }

    /* get certificates to populate in dropdown */
    function getAppointments(res, mysql, context, complete){
        sql = "SELECT appt_id AS apid, assist FROM dc_appt";
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.appointments = results
            complete();
        });
    }

    /* get people with their certificates */
    /* TODO: get multiple certificates in a single column and group on
     * assist_name or id column
     */
    function getAssistantsWithAppointments(res, mysql, context, complete){
        sql = "SELECT aid, apid, CONCAT(assist_name) AS name, assist AS assistant FROM dc_dentAssist INNER JOIN dc_appt_assist on dc_dentAssist.assist_id = dc_appt_assist.aid INNER JOIN dc_appt on dc_appt.appt_id = dc_appt_assist.apid ORDER BY name, assistant"
         mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.assistant_with_appts = results
            complete();
        });
    }


    /* List people with certificates along with
     * displaying a form to associate a person with multiple certificates
     */
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js"];
        var mysql = req.app.get('mysql');
        var handlebars_file = 'appt_assist'

        getAssistants(res, mysql, context, complete);
        getAppointments(res, mysql, context, complete);
        getAssistantsWithAppointments(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render(handlebars_file, context);
            }
        }
    });

    /* Associate certificate or certificates with a person and
     * then redirect to the assistant_with_appts page after adding
     */
    router.post('/', function(req, res){
        console.log("We get the multi-select assistant dropdown as ", req.body.appts)
        var mysql = req.app.get('mysql');
        // let's get out the certificates from the array that was submitted by the form
        var appointments = req.body.appts
        var person = req.body.aid
        for (let appt of appointments) {
          console.log("Processing assistant id " + appt)
          var sql = "INSERT INTO dc_appt_assist (aid, apid) VALUES (?,?)";
          var inserts = [person, appt];
          sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                //TODO: send error messages to frontend as the following doesn't work
                /*
                res.write(JSON.stringify(error));
                res.end();
                */
                console.log(error)
            }
          });
        } //for loop ends here
        res.redirect('/appt_assist');
    });

    /* Delete a person's certification record */
    /* This route will accept a HTTP DELETE request in the form
     * /pid/{{pid}}/appt/{{apid}} -- which is sent by the AJAX form
     */
    router.delete('/aid/:aid/appt/:apid', function(req, res){
        //console.log(req) //I used this to figure out where did pid and apid go in the request
        console.log(req.params.aid)
        console.log(req.params.apid)
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM dc_appt_assist WHERE aid = ? AND apid = ?";
        var inserts = [req.params.aid, req.params.apid];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();
