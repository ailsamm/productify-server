const path = require('path')
const express = require('express')
const xss = require('xss')
const UsersInfoService = require('./users-info-service')
const usersRouter = express.Router()
const jsonParser = express.json()

const serializeUserInfo = user => ({
  id: user.id,
  first_name: xss(user.first_name),
  last_name: xss(user.last_name),
  job_title: xss(user.job_title),
  team_id: user.team_id,
});

usersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    
    UsersInfoService.getAllUsers(knexInstance)
      .then(users => {
        res.json(users.map(serializeUserInfo))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { first_name, last_name, job_title, team_id, id } = req.body
    const newUserInfo = { first_name, last_name, job_title, team_id, id }

    for (const [key, value] of Object.entries({ first_name, last_name, job_title, team_id, id })) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    UsersInfoService.insertUser(
      req.app.get('db'),
      newUserInfo
    )
      .then(user => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`))
          .json(serializeUserInfo(user))
      })
      .catch(next)
  })

  usersRouter
  .route('/:user_id')
  .all((req, res, next) => {
    UsersInfoService.getById(
      req.app.get('db'),
      req.params.user_id
    )
      .then(user => {
        console.log(user)
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` }
          })
        }
        res.user = user
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    console.log("in here")
    res.json(serializeUserInfo(res.user))
  })
  .delete((req, res, next) => {
    UsersInfoService.deleteUser(
      req.app.get('db'),
      req.params.user_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { first_name, last_name, job_title, team_id, id } = req.body
    const userToUpdate = { first_name, last_name, job_title, team_id }

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'first_name', 'last_name', 'job_title' or 'team_id'`
        }
      })

    UsersInfoService.updateUser(
      req.app.get('db'),
      req.params.user_id,
      userToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = usersRouter