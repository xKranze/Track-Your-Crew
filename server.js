const express = require('express');
const mysql = require('mysql2');
const showTable = require('console.table');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3001;
const app = express();
const env = require('dotenv').config();


// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Connect to database via mysql
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
//throws error if theres issue connecting with a err message and stack trace if successful then app title "track your crew" will display!
connection.connect(function (err) {
  if (err) {
    console.error('Error connecting to employees database: ' + err.stack);
    return;
  }
  console.log(`
 ████████╗██████╗  █████╗  ██████╗██╗  ██╗     ██╗ ██╗  ██████╗ ██╗   ██╗██████╗      ██████╗██████╗ ███████╗██╗    ██╗
 ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝    ╚██╗ ██╔╝██╔═══██╗██║   ██║██╔══██╗    ██╔════╝██╔══██╗██╔════╝██║    ██║
    ██║   ██████╔╝███████║██║     █████╔╝      ╚████╔╝ ██║   ██║██║   ██║██████╔╝    ██║     ██████╔╝█████╗  ██║ █╗ ██║
    ██║   ██╔══██╗██╔══██║██║     ██╔═██╗       ╚██╔╝  ██║   ██║██║   ██║██╔══██╗    ██║     ██╔══██╗██╔══╝  ██║███╗██║
    ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗       ██║   ╚██████╔╝╚██████╔╝██║  ██║    ╚██████╗██║  ██║███████╗╚███╔███╔╝
    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝       ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝     ╚═════╝╚═╝  ╚═╝╚══════╝ ╚══╝╚══╝ `)
  // initialize promt
  startQuestions();
});

// Continuous loop that inquires the user for options to select
// Allows user to interact with the database as needed.
function startQuestions() {
  inquirer.prompt([
    //choose what you want to do
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
        'Update an employee role',
        'Exit'
      ]
    },
  ])
    .then(data => {

      //switch case to handle option picked
      switch (data.initiate) {

        // Displays the department table from the database connection
        case 'View all departments':
          connection.query('SELECT * FROM department', function (err, results) {
            console.table(results);
            startQuestions();
          });
          break;

        // Displays the role table from the database connection
        case 'View all roles':
          connection.query('SELECT * FROM role', function (err, results) {
            console.table(results);
            startQuestions();
          });
          break;

        // Displays the employees table from the database connection
        case 'View all employees':
          connection.query('SELECT * FROM employee', function (err, results) {
            console.table(results);
            startQuestions();
          });
          break;

        // Allows the user to add a new department to the database by providing a department name.
        case 'Add a department':
          inquirer.prompt([
            {
              type: 'text',
              name: 'department',
              message: 'What department would you like to add?',
            },
          ])
            .then(data => {
              connection.query(`INSERT INTO department(department_name) VALUES ("${data.department}");`, (err, result) => {
                if (err) {
                  console.log(err);
                  startQuestions();
                } else {
                  console.log("Success!");
                  connection.query('SELECT * FROM department', function (err, results) {
                    console.table(results);
                    startQuestions();
                  });
                }
              });
            })
          break;

        // Allows the user to add a new role to the database by providing a title for the role, the department the role belongs to, and the salary for the role.
        case 'Add a role':
          var departments = [];
          connection.query('SELECT department_name FROM department', function (err, results) {
            for (var i = 0; i < results.length; i++) {
              departments.push(i + 1 + ". " + results[i].department_name);
            }

            inquirer.prompt([
              {
                type: 'text',
                name: 'title',
                message: 'What is the title of the new role?',
              },
              {
                type: 'list',
                name: 'department',
                message: 'What department does the new role belong to?',
                choices: departments
              },
              {
                type: 'text',
                name: 'salary',
                message: 'What is the salary of the new role?',
              }
            ])
              .then(data => {
                connection.query(`INSERT INTO role(title, department_id, salary) VALUES ("${data.title}", ${departments.indexOf(data.department) + 1}, ${data.salary});`, (err, result) => {
                  if (err) {
                    console.log(err);
                    startQuestions();
                  } else {
                    console.log("Success!");
                    connection.query('SELECT * FROM role', function (err, results) {
                      console.table(results);
                      startQuestions();
                    });
                  }
                });
              })
          });
          break;

        // Allows the user to add a new employee to the database by providing the employee's firstname, last name, role, and the employee's manager.
        case 'Add an employee':
          var roles = [];
          connection.query('SELECT title FROM role', function (err, results) {
            for (var i = 0; i < results.length; i++) {
              roles.push(i + 1 + ". " + results[i].title);
            }

            var employees = [];
            connection.query('SELECT first_name, last_name FROM employee', function (err, results) {
              for (var i = 0; i < results.length; i++) {
                employees.push(i + 1 + ". " + results[i].first_name + " " + results[i].last_name);
              }

              inquirer.prompt([
                {
                  type: 'text',
                  name: 'first',
                  message: 'What is the first name of the employee?'
                },
                {
                  type: 'text',
                  name: 'last',
                  message: 'What is the last name of the employee?'
                },
                {
                  type: 'list',
                  name: 'role',
                  message: `What is the employee's new role?`,
                  choices: roles
                },
                {
                  type: 'list',
                  name: 'manager',
                  message: `Who is the employee's manager?`,
                  choices: employees
                }
              ])
                .then(data => {
                  connection.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("${data.first}", "${data.last}", ${roles.indexOf(data.role) + 1}, ${employees.indexOf(data.manager) + 1});`, (err, result) => {
                    if (err) {
                      console.log(err);
                      startQuestions();
                    } else {
                      console.log("Success!");
                      connection.query('SELECT * FROM employee', function (err, results) {
                        console.table(results);
                        startQuestions();
                      });
                    }
                  });
                })
            });
          });
          break;

        // Allows the user to update an existing employee's role.
        case 'Update an employee role':
          var roles = [];
          connection.query('SELECT title FROM role', function (err, results) {
            for (var i = 0; i < results.length; i++) {
              roles.push(i + 1 + ". " + results[i].title);
            }

            var employees = [];
            connection.query('SELECT first_name, last_name FROM employee', function (err, results) {
              for (var i = 0; i < results.length; i++) {
                employees.push(i + 1 + ". " + results[i].first_name + " " + results[i].last_name);
              }
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'employee',
                  message: 'Whose role would you like to update?',
                  choices: employees
                },
                {
                  type: 'list',
                  name: 'role',
                  message: 'What is the new role of the employee?',
                  choices: roles
                }
              ])
                .then(data => {
                  connection.query(`UPDATE employee SET role_id = ${roles.indexOf(data.role) + 1} WHERE id = ${employees.indexOf(data.employee) + 1}`, (err, result) => {
                    if (err) {
                      console.log(err);
                      startQuestions();
                    } else {
                      console.log("Success!");
                      connection.query('SELECT * FROM employee', function (err, results) {
                        console.table(results);
                        startQuestions();
                      });
                    }
                  });
                })
            });
          });
          break;

        // Closes the database and the port, exiting the app.
        case 'Exit':
          connection.close();
          server.close();
          break;
        default:
      }
    })
}

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// Starts the connection for the port to listen
var server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
