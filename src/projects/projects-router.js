const path = require('path')
const express = require('express')
const xss = require('xss')
const projectsService = require('./projects-service')
const projectsRouter = express.Router()
const jsonParser = express.json()

const serializeProject = project => ({
  id: project.id,
  project_name: xss(project.project_name),
});

projectsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    
    projectsService.getAllProjects(knexInstance)
      .then(projects => {
        res.json(projects.map(serializeProject))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { project_name, team_id, id } = req.body
    const newProject = { project_name, team_id, id }

    for (const [key, value] of Object.entries({ project_name, team_id, id })) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    projectsService.insertProject(
      req.app.get('db'),
      newProject
    )
      .then(project => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${project.id}`))
          .json(serializeProject(project))
      })
      .catch(next)
  })

  projectsRouter
  .route('/:project_id')
  .all((req, res, next) => {
    projectsService.getById(
      req.app.get('db'),
      req.params.project_id
    )
      .then(project => {
        if (!project) {
          return res.status(404).json({
            error: { message: `Project doesn't exist` }
          })
        }
        res.project = project
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeProject(res.project))
  })
  .delete((req, res, next) => {
    projectsService.deleteProject(
      req.app.get('db'),
      req.params.project_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { project_name } = req.body
    const projectToUpdate = { project_name }

    const numberOfValues = Object.values(projectToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain 'project_name'`
        }
      })

    projectsService.updateProject(
      req.app.get('db'),
      req.params.project_id,
      projectToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = projectsRouter