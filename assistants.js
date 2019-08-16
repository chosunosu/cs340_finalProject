module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getAssistants(res, mysql, context, complete){
      mysql.pool.query("SELECT assist_id, assist_name, assist_extension, dc_doctor.name AS position FROM dc_dentAssist INNER JOIN dc_doctor ON position = dc_doctor.doctor_id", function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.assistants  = results;
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
      getAssistants(res, mysql, context, complete)
      function complete(){
          callbackCount++;
          if(callbackCount >= 2){
              res.render('assistants', context);
          }

      }
  });

    router.post('/', function(req, res){
      console.log(req.body.homeworld)
      console.log(req.body)
      var mysql = req.app.get('mysql');
      var sql = "INSERT INTO dc_dentAssist (assist_name, position, assist_extension) VALUES (?,?,?)";
      var inserts = [req.body.assist_name, req.body.position, req.body.assist_extension];
      sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
              console.log(JSON.stringify(error))
              res.write(JSON.stringify(error));
              res.end();
          }else{
              res.redirect('/assistants');
          }
      });
  });

    return router;
}();
