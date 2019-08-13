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

    function serveOneDoctor(chicken, steak) {
      console.log(chicken.params.fancyId);
      console.log(chicken.params);
      fancyId = chicken.params.fancyId

      var queryString = "SELECT doctor_id, name, specialty, extension FROM dc_doctor WHERE doctor_id = ?"

      var mysql = steak.app.get('mysql')
      var context = {};

      function handleRenderingOfOneDoctor(error, results, fields){
          console.log("results are " + results)
          context.doctor = results[0]
          console.log(context)

          if(error){
            console.log(error)
            steak.write(error)
            steak.end();
          }else{
            steak.render('serverDoctor',context);
          }
      }
      //execute the query
      var queryString = mysql.pool.query(queryString, fancyId, handleRenderingOfOneDoctor);

      //steak.send("Here's a good tasty well done steak");
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
