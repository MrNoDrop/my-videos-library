import mysql from 'mysql';

const db = (() => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'app',
    password: 'password',
    database: 'my_videos_app'
  });

  connection.connect();
  return connection;
})();

export default sql =>
  new Promise((resolve, reject) => {
    db.query(sql, (err, results) => (err ? reject(err) : resolve(results)));
  });
