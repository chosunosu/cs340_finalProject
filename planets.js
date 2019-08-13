module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPlanets(res, mysql, context, complete){
      mysql.pool.query("SELECT planet_id as id, name FROM bsg_planets", function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.planets  = results;
          complete();
      });
    }

    
    function servePlanets(req, res){
        console.log("You asked me for some planets?")
        var query = 'SELECT planet_id, name, population, language, capital FROM bsg_planets';
        var mysql = req.app.get('mysql');
        var context = {};

        function handleRenderingOfPlanets(error, results, fields){
          console.log(error)
          console.log(results)
          console.log(fields)
          //take the results of that query and store ti inside context
          context.planets = results;
          //pass it to handlebars to put inside a file
          res.render('planets', context)
        }
        //execute the sql query
        mysql.pool.query(query, handleRenderingOfPlanets)

        //res.send('Here you go!');
    }

    function serveOnePlanet(chicken, steak) {
      console.log(chicken.params.fancyId);
      console.log(chicken.params);
      fancyId = chicken.params.fancyId

      var queryString = "SELECT planet_id, name, population, language, capital FROM bsg_planets WHERE planet_id = ?"

      var mysql = steak.app.get('mysql')
      var context = {};

      function handleRenderingOfOnePlanet(error, results, fields){
          console.log("results are " + results)
          context.planet = results[0]
          console.log(context)

          if(error){
            console.log(error)
            steak.write(error)
            steak.end();
          }else{
            steak.render('serverPlanet',context);
          }
      }
      //execute the query
      var queryString = mysql.pool.query(queryString, fancyId, handleRenderingOfOnePlanet);

      //steak.send("Here's a good tasty well done steak");
    }

    router.post('/', function(req, res){
      console.log(req.body.homeworld)
      console.log(req.body)
      var mysql = req.app.get('mysql');
      var sql = "INSERT INTO bsg_planets (name, population, language, capital) VALUES (?,?,?,?)";
      var inserts = [req.body.name, req.body.population, req.body.language, req.body.capital];
      sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
              console.log(JSON.stringify(error))
              res.write(JSON.stringify(error));
              res.end();
          }else{
              res.redirect('/planets');
          }
      });
  });

    router.get('/', servePlanets);
    
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
