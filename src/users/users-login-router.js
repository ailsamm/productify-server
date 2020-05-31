const path = require('path')
const express = require('express')
const xss = require('xss')
const usersLoginService = require('./users-login-service')
const usersLoginRouter = express.Router()
const jsonParser = express.json()

const serializeUserLogin = user => ({
  user_id: user.user_id,
  email_address: xss(user.email_address),
  password: xss(user.password)
});

usersLoginRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    
    usersLoginService.getAllUsers(knexInstance)
      .then(users => {
        res.json(users.map(serializeUserLogin))
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

    usersLoginService.insertUser(
      req.app.get('db'),
      newUserInfo
    )
      .then(user => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`))
          .json(serializeUserLogin(user))
      })
      .catch(next)
  })

  usersLoginRouter
  .route('/:user_id')
  .all((req, res, next) => {
    usersLoginService.getById(
      req.app.get('db'),
      req.params.user_id
    )
      .then(user => {
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
    res.json(serializeUserLogin(res.user))
  })
  .delete((req, res, next) => {
    usersLoginService.deleteUser(
      req.app.get('db'),
      req.params.user_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = usersLoginRouter