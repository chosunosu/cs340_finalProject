module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPatients(res, mysql, context, complete){
      mysql.pool.query("SELECT patient_id, patient_name, address, phone, dc_doctor.name AS assigned FROM dc_patient INNER JOIN dc_doctor ON assigned = dc_doctor.doctor_id", function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.patients  = results;
          complete();
      });
    }

    function getDoctors(res, mysql, context, complete){
      mysql.pool.query("SELECT doctor_id AS id, name FROM dc_doctor", function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.doctors  = results;
          complete();
      });
  }

    router.get('/', function(req, res){
      var callbackCount = 0;
      var context = {};
      var mysql = req.app.get('mysql');
      getDoctors(res, mysql, context, complete);
      getPatients(res, mysql, context, complete)
      function complete(){
          callbackCount++;
          if(callbackCount >= 2){
              res.render('patients', context);
          }

      } 
  });

    router.post('/', function(req, res){
      console.log(req.body.doctor_id)
      console.log(req.body)
      var mysql = req.app.get('mysql');
      var sql = "INSERT INTO dc_patient (patient_name, address, phone, assigned) VALUES (?,?,?,?)";
      var inserts = [req.body.name, req.body.address, req.body.phone, req.body.assigned];
      sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
              console.log(JSON.stringify(error))
              res.write(JSON.stringify(error));
              res.end();
          }else{
              res.redirect('/patients');
          }
      });
  });

    return router;
}();
