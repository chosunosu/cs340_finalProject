var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_chosun',
  password        : '2726',
  database        : 'cs290_chosun'
});
module.exports.pool = pool;
