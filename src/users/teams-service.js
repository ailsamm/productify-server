const TeamsService = {
    getAllTeams(knex) {
      return knex.select('*').from('productify_teams')
    },
    insertTeam(knex, newTeam){
      return knex
          .insert(newTeam)
          .into('productify_teams')
          .returning('*')
          .then(rows => {
            return rows[0]
      })
    },
    deleteTeam(knex, id){
      return knex('productify_teams')
          .where({ id })
          .delete()
    },
    getById(knex, id){
      return knex
        .from('productify_teams')
        .select('*')
        .where({ id })
        .first()
    },
    updateTeam(knex, id, newTeamFields) {
      return knex('productify_teams')
        .where({ id })
        .update(newTeamFields)
    }
  }
  
  module.exports = TeamsService;