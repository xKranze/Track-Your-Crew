const express = require('express');
const mysql = require('mysql2');
const showTable = require('console.table');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3001;
const app = express();
const Sequelize = require('sequelize');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Connect to database via mysql
const connection = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',//process.env.DB_USER,
    // MySQL password
    password: 'Chester630!',//process.env.DB_PASSWORD,
    database: 'employees_db'//process.env.DB_NAME
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
 ████████╗██████╗  █████╗  ██████╗██╗  ██╗     ██╗ ██╗  ██████╗ ██╗   ██╗██████╗      ██████╗██████╗ ███████╗██╗    ██╗
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

    .then(data => {
      switch (data.initiate) {
        case 'View all departments':
          connection.query('SELECT * FROM department', function (err, results) {
            console.table(results);
          });
          break;

        case 'View all roles':
          connection.query('SELECT * FROM role', function (err, results) {
            console.table(results);
          });
          break;

        case 'View all employees':
          connection.query('SELECT * FROM employee', function (err, results) {
            console.table(results);
          });
          break;

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
                } else {
                  console.log("Success!");
                  connection.query('SELECT * FROM department', function (err, results) {
                    console.table(results);
                  });
                }
              });
            })
          break;

        case 'Add a role':
          var departments = [];
          connection.query('SELECT department_name FROM department', function (err, results) {
            for (var i = 0; i < results.length; i++) {
              departments.push(results[i].department_name);
            }
          });

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
                } else {
                  console.log("Success!");
                  connection.query('SELECT * FROM role', function (err, results) {
                    console.table(results);
                  });
                }
              });
            })
          break;

        case 'Add an employee':
          var roles = [];
          connection.query('SELECT title FROM role', function (err, results) {
            for (var i = 0; i < results.length; i++) {
              roles.push(results[i].title);
            }
          });

          var employees = [];
          connection.query('SELECT first_name, last_name FROM employee', function (err, results) {
            for (var i = 0; i < results.length; i++) {
              employees.push(results[i].first_name + " " + results[i].last_name);
            }
          });

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
                } else {
                  console.log("Success!");
                  connection.query('SELECT * FROM employee', function (err, results) {
                    console.table(results);
                  });
                }
              });
            })
          break;

        case 'Update an employee role':
          var roles = [];
          connection.query('SELECT title FROM role', function (err, results) {
            for (var i = 0; i < results.length; i++) {
              roles.push(results[i].title);
            }
          });

          var employees = [];
          connection.query('SELECT first_name, last_name FROM employee', function (err, results) {
            for (var i = 0; i < results.length; i++) {
              employees.push(results[i].first_name + " " + results[i].last_name);
            }
          });

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
              connection.query(`UPDATE employee SET role_id = ${roles.indexOf(data.role)+1} WHERE id = ?`, (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Success!");
                  connection.query('SELECT * FROM employee', function (err, results) {
                    console.table(results);
                  });
                }
              });
            })








          connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, role_id, employee_id, (err, result) => {
            if (err) {
              console.log(err);
            }
            console.table(result);
          });
          break;
        default:
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
