# Employee-tracker

## Table of Contents
* [Description](#Description)
* [Video Demonstration](#Video_Demonstration)
* [Technologies](#Technologies)
* [Future Development](#Future_Development)
* [Contributing](#Contributing)
* [License](#License)

## Description
A basic content management system that allows a user to fill out a team roster that includes the employees' ID number, department, role, salary, etc. 
Input is collected via the inquirer module and then that data is stored in the MySQL database for later use. Based on what the user chooses to do, 
they can create new entries, update existing employee information, delete records that are no longer needed, and see overviews of all the information
in each table of the database or the entirety of the database at once. 

## Video Demonstration
Link [https://drive.google.com/file/d/1Q8bZOeP3Oo494DBkEHeMl4JrsW4SurIn/view?usp=sharing]


## Technologies
* JavaScript 
* MySQL (https://www.npmjs.com/package/mysql)
* Inquirer (https://www.npmjs.com/package/inquirer)
* Dotenv (https://www.npmjs.com/package/dotenv)
* Console table

## Future Development
In the future I would like to convert this application to utilize a connection pool instead of creating and closing a connection on each JS file.
The schema should also be altered to include more employee information that would be pertinent to a work environment like email, phone number, etc. 
Finally, I would like to include functionality that would update multiple employee records at once since department deletions can affect a large
number of records and only singular employees can be updated a time currently. 

## Contributing 
All contributions to this project are welcomed. Please contact the creator at tjessee7624@gmail.com
with any questions or concerns. 

## License
MIT License

Copyright (c) 2020 Jonathan Jessee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.