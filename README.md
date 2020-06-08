# Productify Server

Productify Server works in conjunction with [Productify](https://github.com/ailsamm/productify). It provides a Postgresql database containing all of the data needed to populate and run the Productify client-side app. 

## Demo

A demo version of the Productify app, using this server, is available [here](https://productify-app.now.sh/).
Use the following dummy credentials to log in and take a tour:

Username: aaa@gmail.

Password: aaa

Please note that this demo version is intended for demo purposes only. For security purposes, we do not recommend that you sign up using your own personal information.

## Installation

Simply clone the repo and run ```npm i```
You can then make requests using, for example, Postman or the Productify client-side app.

## Databases
This repo contains 5 routers that connect to 5 separate Postgresql tables. These are as follows:
* /api/users-info - contains personal information about signed up users (first_name, last_name, job_title, id, team_id)
* /api/users-login - contains log in information about sign up users (email_address, password, user_id)
* /api/teams - contains information about each registered team (team_name, id)
* /api/projects - contains information about each existing project (project_name, team_id, id)
* /api/tasks - contains information about each existing task (task_name, id, description, deadline, project_id, status, assignee)

Further details may be found in the 'Endpoints' section.

## API Overview

```
/api
.
├── /tasks
│   └── GET
│       ├── /
│       └── /:taskId
│
│   └── POST /
│
│   └── DELETE /:taskId
│
│   └── PATCH /:taskId
│
├── /projects
│   └── GET
│       ├── /
│       └── /:projectId
│
│   └── POST
│       └── /
│
│   └── DELETE /:projectId
│
│   └── PATCH /:projectId
│
├── /teams
│   └── GET
│       ├── /
│       └── /:teamId
│
│   └── POST /
│
│   └── DELETE /:teamId
│
│   └── PATCH /:teamId
│
├── /users-info
│   └── GET
│       ├── /
│       └── /:userId
│
│   └── POST /
│
│   └── DELETE /:userId
│
│   └── PATCH /:userId
│
└── /users-login
    └── GET
        ├── /
        └── /:userId
 
    └── POST /
 
    └── DELETE /:userId

```

## Endpoint specifications
### GET ```/api/projects```

```
// res.body
[
 {
  id: Integer,
  project_name: String,
  team_id: Integer
 }
]
```

### POST ```/api/projects```

```
// req.body
{
  id: Integer,
  project_name: String,
  team_id: Integer
}

// res.body
{
  id: Integer,
  project_name: String,
  team_id: Integer
}
```

### GET ```/api/projects/:projectId```

```
// req.params
{
  projectId: Integer
}

// res.body
{
  id: Integer,
  project_name: String,
  team_id: Integer
}
```

### DELETE ```/api/projects/:projectId```

```
// req.params
{
  projectId: Integer
}

// res.body
{
  status: 204
}
```

### PATCH ```/api/projects/:projectId```

```
// req.params
{
  projectId: Integer
}

// req.body
{
  project_name: String
}

// res.body
{
  status: 204
}
```


## Tech Stack
The Productify Server is written with NodeJS, Express and hooks up to a Postgresql server using Knex. It also makes use of Mocha and Chai for testing purposes.
