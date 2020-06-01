const path = require('path')
const express = require('express')
const xss = require('xss')
const teamsService = require('./teams-service')
const teamsRouter = express.Router()
const jsonParser = express.json()

const serializeTeam = team => ({
  id: team.id,
  team_name: xss(team.team_name),
  team_id: team.team_id
});

teamsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    
    teamsService.getAllTeams(knexInstance)
      .then(teams => {
        res.json(teams.map(serializeTeam))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { team_name, id } = req.body
    const newTeam = { team_name, id }

    for (const [key, value] of Object.entries({ team_name, id })) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    teamsService.insertTeam(
      req.app.get('db'),
      newTeam
    )
      .then(team => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${team.id}`))
          .json(serializeTeam(team))
      })
      .catch(next)
  })

  teamsRouter
  .route('/:team_id')
  .all((req, res, next) => {
    teamsService.getById(
      req.app.get('db'),
      req.params.team_id
    )
      .then(team => {
        if (!team) {
          return res.status(404).json({
            error: { message: `Team doesn't exist` }
          })
        }
        res.team = team
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeTeam(res.team))
  })
  .delete((req, res, next) => {
    teamsService.deleteTeam(
      req.app.get('db'),
      req.params.team_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { team_name } = req.body
    const teamToUpdate = { team_name }

    const numberOfValues = Object.values(teamToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain 'team_name'`
        }
      })

    teamsService.updateTeam(
      req.app.get('db'),
      req.params.team_id,
      teamToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = teamsRouter