const path = require('path');
const express = require('express');
const xss = require('xss');
const tasksService = require('./tasks-service');
const tasksRouter = express.Router();
const jsonParser = express.json();

const serializeTask = task => ({
  id: task.id,
  project_id: task.project_id,
  task_name: xss(task.task_name),
  description: xss(task.description),
  deadline: xss(task.deadline),
  status: xss(task.status),
  assignee: task.assignee
});

tasksRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    tasksService.getAllTasks(knexInstance)
      .then(tasks => {
        res.json(tasks.map(serializeTask));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { id, project_id, task_name, description, deadline, assignee } = req.body;
    const newTask = { 
        id, 
        project_id, 
        task_name, 
        description, 
        deadline,
        assignee, 
        status:"backlog"
    };

    for (const [key, value] of Object.entries({ id, project_id, task_name, description, deadline, assignee })) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    tasksService.insertTask(
      req.app.get('db'),
      newTask
    )
      .then(task => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${task.id}`))
          .json(serializeTask(task))
      })
      .catch(next);
  })

  tasksRouter
  .route('/:project_id')
  .all((req, res, next) => {
    tasksService.getById(
      req.app.get('db'),
      req.params.project_id
    )
      .then(task => {
        if (!task) {
          return res.status(404).json({
            error: { message: `Task doesn't exist` }
          });
        }
        res.task = task;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeTask(res.task));
  })
  .delete((req, res, next) => {
    tasksService.deleteTask(
      req.app.get('db'),
      req.params.project_id
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { task_name, description, deadline, status, assignee } = req.body
    const taskToUpdate = { task_name, description, deadline, status, assignee }

    const numberOfValues = Object.values(taskToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'task_name', 'description', 'deadline', 'status' or 'assignee'.`
        }
      })

    tasksService.updateTask(
      req.app.get('db'),
      req.params.project_id,
      taskToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = tasksRouter