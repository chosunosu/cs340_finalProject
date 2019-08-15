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
  
      


    function serveBills(req, res){
        console.log("Searching for Patient billing?")
        var query = 'SELECT bill_id as id, bill_patient, date, total_cost, payment_type, bill_due, status FROM dc_bill';
        var mysql = req.app.get('mysql');
        var context = {};

        function handleRenderingOfBills(error, results, fields){
          console.log(error)
          console.log(results)
          console.log(fields)
          //take the results of that query and store ti inside context
          context.bills = results;
          //pass it to handlebars to put inside a file
          res.render('bills', context)
        }
        //execute the sql query
        mysql.pool.query(query, handleRenderingOfBills)

        //res.send('Here you go!');
    }

    function serveOneBill(chicken, steak) {
      console.log(chicken.params.fancyId);
      console.log(chicken.params);
      fancyId = chicken.params.fancyId

      var queryString = "SELECT bill_id as id, bill_patient, date, total_cost, payment_type, bill_due, status FROM dc_bill WHERE bill_id = ?"

      var mysql = steak.app.get('mysql')
      var context = {};

      function handleRenderingOfOneBill(error, results, fields){
          console.log("results are " + results)
          context.bill = results[0]
          console.log(context)

          if(error){
            console.log(error)
            steak.write(error)
            steak.end();
          }else{
            steak.render('serverBill',context);
          }
      }
      //execute the query
      var queryString = mysql.pool.query(queryString, fancyId, handleRenderingOfOneBill);

      //steak.send("Here's a good tasty well done steak");
    }

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

    //router.get('/', serveBills);

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
