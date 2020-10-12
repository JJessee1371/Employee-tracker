module.exports = function viewData() {
    inquirer.prompt([
        {
            name: 'choice',
            type: 'list',
            choices: [
                'View department',
                'View roles',
                'View employees'
            ],
            message: 'Please select the action you would like to perform:'
        }
    ])
    .then((data) => {
        let choice = data.choice;

        switch(choice) {
            case 'View department':
                connection.query(
                    'SELECT * FROM department',
                    function(err, res) {
                        if(err) throw err;
                        console.log(res);
                    }
                );
                break;

            case 'View roles':
                connection.query(
                    'SELECT * FROM role',
                    function(err, res) {
                        if(err) throw err;
                        console.log(res);
                    }
                );
                break;

            case 'View employees':
                connection.query(
                    'SELECT * FROM employee',
                    function(err, res) {
                        if(err) throw err;
                        console.log(res);
                    }
                );
                break;
        };
    });
};