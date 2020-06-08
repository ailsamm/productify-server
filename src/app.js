require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./logger');
const { NODE_ENV } = require('./config');
const usersInfoRouter = require('./users/users-info-router');
const usersLoginRouter = require('./users/users-login-router');
const teamsRouter = require('./users/teams-router');
const projectsRouter = require('./projects/projects-router');
const tasksRouter = require('./projects/tasks-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } 
  else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
})

app.use('/api/users-info', usersInfoRouter);
app.use('/api/users-login', usersLoginRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);

app.get('/', (req, res) => {
   res.send('Hello, boilerplate!');
})

module.exports = app;
