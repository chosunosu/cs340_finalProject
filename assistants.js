module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getAssistants(res, mysql, context, complete){
      mysql.pool.query("SELECT assist_id as id, name FROM dc_dentAssist", function(error, results, fields){
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
        var query = 'SELECT assist_id, name, position, extension FROM dc_dentAssist';
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

      var queryString = "SELECT assist_id, name, position, extension FROM dc_dentAssist WHERE assist_id = ?"

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

    router.post('/', function(req, res){
      console.log(req.body.homeworld)
      console.log(req.body)
      var mysql = req.app.get('mysql');
      var sql = "INSERT INTO dc_dentAssist (name, position, extension) VALUES (?,?,?)";
      var inserts = [req.body.name, req.body.position, req.body.extension];
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

    router.get('/', serveAssistants);

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
