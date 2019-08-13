var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_chosun',
  password        : '2726',
  database        : 'cs340_chosun'
});
module.exports.pool = pool;
