const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: '', // Replace with your MySQL password
  database: 'workmate_db', // Replace with your database name
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});


router.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected to API' });
  });

  
// Add user API endpoint
router.post('/addUser', (req, res) => {
    const { email, username, password } = req.body;
  
    const addUserQuery = `INSERT INTO userList (username, email, password, addedAt) VALUES (?, ?, ?, NOW())`;
    connection.query(addUserQuery, [username, email, password], (error, results) => {
      if (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Failed to add user' });
        return;
      }
      console.log('User added successfully');
      res.status(200).json({ message: 'User added successfully' });
    });
  });
  

router.get('/getUser', (req, res) => {
    const getUserQuery = `SELECT * FROM userList`;
    connection.query(getUserQuery, (error, results) => {
      if (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Failed to get users' });
        return;
      }
      // Respond with the retrieved user data
      res.status(200).json({ users: results });
    });
  });

  router.get('/getUserTaskStatus', (req, res) => {
    const getUserStatusQuery = `SELECT ts.*, ul.userName AS Name FROM task_status ts LEFT JOIN userList ul ON ts.userid = ul.id`;
    connection.query(getUserStatusQuery, (error, results) => {
      if (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Failed to get users' });
        return;
      }
      // Respond with the retrieved user data including the user's name
      res.status(200).json({ UserTaskStatus: results });
    });
  });

  router.get('/getUserTaskStatusById/:id', (req, res) => {
    const userId = req.params.id;
    const getUserStatusQuery = `SELECT ts.*, ul.userName AS Name FROM task_status ts LEFT JOIN userList ul ON ts.userid = ul.id WHERE ts.userid = ${userId}`;
    connection.query(getUserStatusQuery, (error, results) => {
      if (error) {
        console.error('Error retrieving user task status:', error);
        res.status(500).json({ error: 'Failed to get user task status' });
        return;
      }
      // Respond with the retrieved user task status including the user's name
      res.status(200).json({ UserTaskStatus: results });
    });
  });
  
  
  

module.exports = router;
