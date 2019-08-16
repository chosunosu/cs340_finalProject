module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getDoctors(res, mysql, context, complete){
      mysql.pool.query("SELECT doctor_id as id, name FROM dc_doctor", function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.doctors  = results;
          complete();
      });
    }

    function serveDoctors(req, res){
        console.log("Searching for doctors?")
        var query = 'SELECT doctor_id, name, specialty, extension FROM dc_doctor';
        var mysql = req.app.get('mysql');
        var context = {};

        function handleRenderingOfDoctors(error, results, fields){
          console.log(error)
          console.log(results)
          console.log(fields)
          //take the results of that query and store ti inside context
          context.doctors = results;
          //pass it to handlebars to put inside a file
          res.render('doctors', context)
        }
        //execute the sql query
        mysql.pool.query(query, handleRenderingOfDoctors)

        //res.send('Here you go!');
    }

    router.post('/', function(req, res){
      console.log(req.body.homeworld)
      console.log(req.body)
      var mysql = req.app.get('mysql');
      var sql = "INSERT INTO dc_doctor (name, specialty, extension) VALUES (?,?,?)";
      var inserts = [req.body.name, req.body.specialty, req.body.extension];
      sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
              console.log(JSON.stringify(error))
              res.write(JSON.stringify(error));
              res.end();
          }else{
              res.redirect('/doctors');
          }
      });
  });

    router.get('/', serveDoctors);

    return router;
}();
