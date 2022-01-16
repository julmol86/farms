# AgroStat web application
# Table of content
- [Prerequisites](#prerequisites)
- [Configurations](#configurations)
- [Running this App](#running-this-app)
- [Running tests](#running-tests)
- [Technologies](#technologies)
- [The goal of this project](#the-goal-of-this-project)
- [Purpose of AgroStat App](#purpose-of-agrostat-app)
- [Main features](#main-features)
- [TODO](#todo)
- [Screenshots](#screenshots)
- [Work log](#work-log)
- [Author](*Author)
# Prerequisites
Application is developed and tested on Windows 10 operating system / Google Chrome browser.

Node.js and PostgreSQL should be installed. 

Note:  PostgreSQL  should be installed on default port 5432. (if port number is different, make sure to change it manually in the db.ts file on the backed side).
# Configurations
Create DB user manually, e.g. via pgAdmin:
 - Login/Group roles -> Create new
 - Username: farms
 - Password: farms
 - Privileges: tick all privileges ON
 - Create manually database named farms. Owner should be user named farms (created in previous steps)
 - Copy-paste queries manually from createTables.sql file to query editor and run those queries. There should be 4 empty tables created.
# Running this App
Download ZIP, Unpack ZIP folder to a new folder.

Make sure postgresql service is running.

Directory for frontend: ./frontend

Directory for backend: ./backend

For backend, run commands via terminal in directory ./backend

```
npm install
```
```
nodemon index.ts
```

For frontend, run commands via terminal in directory ./frontend

```
npm install
```
```
npm start
```

Open http://localhost:3000 to view  in the browser


# Running Tests

### Integration tests
directory for backend: ./backend

Make sure that backend is stopped and not running. (ctrl+C)

DB service should be running.

run command via terminal in directory ./backend

```
npm run test
```

### e2e tests
directory for e2e: ./e2e

For e2e, run commands via terminal in directory ./e2e

```
npm install
```
```
.\node_modules\.bin\cypress open
```

The cypress dialog window will open, from where you can run a single test or the whole test suite at once.

# Technologies
### Front-end
React.js | TypeScript | Bootstrap
### Back-end
Node.js | Koa.js
### Database
PostgreSQL

I chose these technologies because I am familiar with them and have been using React and Node during my current internship. Additionally, I believe they suite current task well.
# The goal of this project
This application is built as pre-assignment for Solita Dev Academy and to gain new knowledge in web development, to practice in creating a full stack application with UI using React and Node, parsing data from CSV files, making Bootstrap styles and working with PostgreSQL database and of course to enjoy coding while doing interesting task.
# Purpose of AgroStat App
Application provides statistical information and graphical representation of farm conditions: temperature, rainfall and pH. There is user registration option for new farm owners and option to add new farm data for registered farms. 
# Main features
**Language switch.** All information is provided in English and Finnish. Selected language is remembered by application also after page refresh.

**Map** with zoom and drag options shows farms' locations.

**Statistics table** with  pagination and filtering options shows farm name, date and time, metric type and metric value. Filtering Options: All farms / selected farm, All metric types / selected metric type. All months /selected month OR by date range.

**Aggregated statistics table** with  pagination and filtering options shows all farms, min value. max value, average value, total amount of data for selected metric type. Filtering options: Metric type, All months /selected month OR by date range.

**Graphs.** The graphical representation of  data can be seen by filtering farm, metric type and month / data range options. A line graph shows how data changes over time.  x-axis : date.  : y-axis: a quantity (temperature/rainfall/pH) in numbers.

**Sign up.** New users can create an account and insert new data for their farms. Info to be provided: farm name, farm coordinates (Latitude and Longitude), username, password. 

**Sign in and sign out.** Already registered users can sign in and sign out. Signed in status is also  remembered by application after page refresh.

**Pop-up notifications.** User can see notification message in case: sign in is successful, sign in is failed, sign out is successful.

**Adding new data.** Registered users are able to add new values for their own farm. User selects metric type from dropdown table and adds manually  metric value. Value is validated and user sees error message if data is out of allowed range. Date and time are added automatically at the moment data is inserted to database.

**User input form validation.** Fields marked with an asterisk are mandatory. User sees a warning message when submit button is pressed and some mandatory fields are empty.
# Screenshots
## Statistics page

![Screenshot 2022-01-16 170901](https://user-images.githubusercontent.com/85441725/149668336-471fb436-7b44-4de8-abf0-136e6dc1be92.png)

## Sign up page

![Screenshot 2022-01-16 170936](https://user-images.githubusercontent.com/85441725/149668344-9ce4bfdd-cee9-40b6-b54d-0fee9a81324e.png)

## Aggregate stats page

![Screenshot 2022-01-16 171040](https://user-images.githubusercontent.com/85441725/149668348-8f91e2d6-4cc4-43df-91ac-0bd61aa5f01f.png)

## Mobile view

![Screenshot 2022-01-16 171142](https://user-images.githubusercontent.com/85441725/149668353-cf104270-a8dd-4b3a-b1f7-fccea3a3f7d7.png)

# TODO
* Running backend in Docker
* Running backend in Cloud
* .env file
* Clear dates when month selected
* Login and password validation on new user creation
* DB programmatic creation
* Improve typescript practices, e.g. remove any:s etc.
# Work log
* 6.01.2022 Frontend: Created new React app, added Bootstrap styles, created Navbar, added localization (English-Finnish) and translation files. 
* 7.01.2022 Backend: Added backend template (Node, Koa) and created tables in PostgreSQL database, connecting Node with PostgreSQL using postgres library.
* 8.01.2022 Backend: added function that parses data from csv files, validates metric values and inserts validated data into DB.
* 9.01.2022 Backend: added linter. Frontend: added table templates for statistics and aggregated statistics, sign up page template, added linter and fixed problems. 
* 10.01.2022 Backend: added endpoint for querying statistical data, includes basic parameter validation
added farm validation. Frontend: sign up page template, added  statistics table content and filtering, added table paginator.
* 11.01.2022 Backend: endpoint for aggregate stats. Frontend: aggregate stats table.
* 12.01.2022 Backend: user and password for farms from CSV files created on csv parsing, password hashing on the backend side (prevents from seeing plain passwords in DB).
* 13.01.2022 Backend: endpoint for creating new farm. Frontend: sign up form for new user registration.
* 14.01.2022 Backend: endpoint for sign in, added month parameter  (statistics calculation), added month parameter (aggregate calculation). Frontend: sign in form and context, sign out  button, notifications (sign in, sign up, sign out), added month-filter to statistics calculation, added month-filter for aggregate calculation. 
* 15.01.2022 Backend: added coordinates to DB table and to /createfarm endpoint, new farm data insertion via UI. Frontend: added graphs, added farm coordinates to sign up form, added map with farm location, new data insertion form. 
* 16.01.2022 Integration tests and e2e tests added.
# Author
Yulia Mozhaeva
