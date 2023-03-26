const express = require('express');
const mysql = require('mysql2');
const showTable = require('console.table');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Connect to database via mysql
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: process.env.DB_USER,
    // MySQL password
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  console.log(`Connected to the employees_db database.`)
);
//throws error if theres issue connecting with a err message and stack trace if successful then app title "track your crew" will display!
connection.connect(function (err) {
  if (err) {
    console.error('Error connecting to employees database: ' + err.stack);
    return;
  }
  console.log(`
  ████████╗██████╗  █████╗  ██████╗██╗  ██╗    ██╗   ██╗ ██████╗ ██╗   ██╗██████╗      ██████╗██████╗ ███████╗██╗    ██╗
╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝    ╚██╗ ██╔╝██╔═══██╗██║   ██║██╔══██╗    ██╔════╝██╔══██╗██╔════╝██║    ██║
   ██║   ██████╔╝███████║██║     █████╔╝      ╚████╔╝ ██║   ██║██║   ██║██████╔╝    ██║     ██████╔╝█████╗  ██║ █╗ ██║
   ██║   ██╔══██╗██╔══██║██║     ██╔═██╗       ╚██╔╝  ██║   ██║██║   ██║██╔══██╗    ██║     ██╔══██╗██╔══╝  ██║███╗██║
   ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗       ██║   ╚██████╔╝╚██████╔╝██║  ██║    ╚██████╗██║  ██║███████╗╚███╔███╔╝
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝       ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝     ╚═════╝╚═╝  ╚═╝╚══════╝ ╚══╝╚══╝ `)
  // initialize promt
  startQuestions();
});

function startQuestions() {
  inquirer.prompt([
    //choose a shape choices circle,triangle, or square.
    {
      type: 'list',
      name: 'initiate',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role'
      ]
    },
  ])

.then((initiate) => {
  console.log('initiate')
 switch (initiate) {
    case 'View all departments':
      // action placeholder
      break;

      case 'View all roles':
      // action placeholder
      break;

      case 'View all employees':
      // action placeholder
      break;

      case 'Add a department':
      // action placeholder
      break;

      case 'Add a role':
      // action placeholder
      break;

      case 'Add an employee':
      // action placeholder
      break;
      
      case 'Update an employee role':
      // action placeholder
  }
})
}

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
