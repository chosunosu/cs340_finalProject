module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPatients(res, mysql, context, complete){
      mysql.pool.query("SELECT patient_id as id, name FROM dc_patient", function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.patients  = results;
          complete();
      });
    }

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

    function servePatients(req, res){
        console.log("Searching for patients?")
        var query = 'SELECT patient_id, name, address, phone, assigned FROM dc_patient';
        var mysql = req.app.get('mysql');
        var context = {};

        function handleRenderingOfPatients(error, results, fields){
          console.log(error)
          console.log(results)
          console.log(fields)
          //take the results of that query and store ti inside context
          context.patients = results;
          //pass it to handlebars to put inside a file
          res.render('patients', context)
        }
        //execute the sql query
        mysql.pool.query(query, handleRenderingOfPatients)

        //res.send('Here you go!');
    }

    function serveOnePatient(chicken, steak) {
      console.log(chicken.params.fancyId);
      console.log(chicken.params);
      fancyId = chicken.params.fancyId

      var queryString = "SELECT patient_id, name, address, phone, assigned FROM dc_patient WHERE patient_id = ?"

      var mysql = steak.app.get('mysql')
      var context = {};

      function handleRenderingOfOnePatient(error, results, fields){
          console.log("results are " + results)
          context.patient = results[0]
          console.log(context)

          if(error){
            console.log(error)
            steak.write(error)
            steak.end();
          }else{
            steak.render('serverPatient',context);
          }
      }
      //execute the query
      var queryString = mysql.pool.query(queryString, fancyId, handleRenderingOfOnePatient);

      //steak.send("Here's a good tasty well done steak");
    }

    router.post('/', function(req, res){
      console.log(req.body.homeworld)
      console.log(req.body)
      var mysql = req.app.get('mysql');
      var sql = "INSERT INTO dc_patient (name, address, phone, assigned) VALUES (?,?,?,?)";
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

    router.get('/', servePatients);

    /*
    router.get('/', function(req, res){
      var callbackCount = 0;
      var context = {};
      //context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
      var mysql = req.app.get('mysql');
      //getPeople(res, mysql, context, complete);
      getPlanets(res, mysql, context, complete);

      function complete(){
          callbackCount++;
          if(callbackCount >= 2){
              res.render('planets', context);
          }

      }

    });
    */

    //router.get('/:fancyId', serveOnePlanet);
    return router;
}();
