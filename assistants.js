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

    function serveAssistants(req, res){
        console.log("Searching for dental assistants?")
        var query = 'SELECT assist_id, assist_name, assist_extension, dc_doctor.name AS position FROM dc_dentAssist INNER JOIN dc_doctor ON position = dc_doctor.doctor_id';
        var mysql = req.app.get('mysql');
        var context = {};

        function handleRenderingOfAssistants(error, results, fields){
          console.log(error)
          console.log(results)
          console.log(fields)
          //take the results of that query and store ti inside context
          context.assistants = results;
          //pass it to handlebars to put inside a file
          res.render('assistants', context)
        }
        //execute the sql query
        mysql.pool.query(query, handleRenderingOfAssistants)

        //res.send('Here you go!');
    }

    function serveOneAssistant(chicken, steak) {
      console.log(chicken.params.fancyId);
      console.log(chicken.params);
      fancyId = chicken.params.fancyId

      var queryString = "SELECT assist_id, assist_name, assist_extension, dc_doctor.name AS position position FROM dc_dentAssist INNER JOIN dc_doctor ON position = dc_doctor.doctor_id WHERE assist_id = ? "

      var mysql = steak.app.get('mysql')
      var context = {};

      function handleRenderingOfOneAssistant(error, results, fields){
          console.log("results are " + results)
          context.assistant = results[0]
          console.log(context)

          if(error){
            console.log(error)
            steak.write(error)
            steak.end();
          }else{
            steak.render('serverAssistant',context);
          }
      }
      //execute the query
      var queryString = mysql.pool.query(queryString, fancyId, handleRenderingOfOneAssistant);

      //steak.send("Here's a good tasty well done steak");
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

    //router.get('/', serveAssistants);

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
