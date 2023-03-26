INSERT INTO department (department_name)
VALUES  ("Management"),
        ("Service"),
        ("Parts");
        

INSERT INTO role (title, department_id, salary)
VALUES  ("General Manger", 1, 120000),
        ("Assistant Store Manager", 1, 85000),
        ("Service Technician", 2, 70000),
        ("Service Advisor", 2, 65000),
        ("Parts Advisor", 3, 55000),
        ("Parts Runner", 3, 45000);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Angela", "Musgrove", 1, 0),
        ("Cameron", "Hino", 2, 1),
        ("Josh", "Dujon", 3, 2),
        ("Oswaldo", "Lopez", 3, 2),
        ("Alex", "Wong", 3, 2),
        ("Marson", "Ear", 4, 2),
        ("Tiffany", "Syharath", 4, 2),
        ("Franklin", "Reid", 5, 2),
        ("Cheryl", "Blanchet", 5, 2),
        ("Mike", "Jones", 6, 2);
        
        
       