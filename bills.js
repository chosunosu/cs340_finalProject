module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getBills(res, mysql, context, complete){
      mysql.pool.query("SELECT bill_id as id, dc_patient.patient_name AS bill_patient, date, total_cost, payment_type, bill_due, status FROM dc_bill INNER JOIN dc_patient ON bill_patient = dc_patient.patient_id", function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.bills  = results;
          complete();
      });
    }

    function getPatients(res, mysql, context, complete){
      mysql.pool.query("SELECT patient_id AS id, patient_name FROM dc_patient", function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.patients  = results;
          complete();
      });
    }

    router.get('/', function(req, res){
      var callbackCount = 0;
      var context = {};
      var mysql = req.app.get('mysql');
      getBills(res, mysql, context, complete);
      getPatients(res, mysql, context, complete)
      function complete(){
          callbackCount++;
          if(callbackCount >= 2){
              res.render('bills', context);
          }
        }
      }
    );
  
    router.post('/', function(req, res){
      console.log(req.body.doctor)
      console.log(req.body)
      var mysql = req.app.get('mysql');
      var sql = "INSERT INTO dc_bill (bill_patient, date, total_cost, payment_type, bill_due, status) VALUES (?,?,?,?,?,?)";
      var inserts = [req.body.bill_patient, req.body.date, req.body.total_cost, req.body.payment_type, req.body.bill_due, req.body.status];
      sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
              console.log(JSON.stringify(error))
              res.write(JSON.stringify(error));
              res.end();
          }else{
              res.redirect('/bills');
          }
      });
  });

    return router;
}();
