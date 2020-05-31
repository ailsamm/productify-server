const ProjectsService = {
    getAllProjects(knex) {
      return knex.select('*').from('productify_projects')
    },
    insertProject(knex, newProject){
      return knex
          .insert(newProject)
          .into('productify_projects')
          .returning('*')
          .then(rows => {
            console.log(rows)
            return rows[0]
      })
    },
    deleteProject(knex, id){
      return knex('productify_projects')
          .where({ id })
          .delete()
    },
    getById(knex, id){
      return knex
        .from('productify_projects')
        .select('*')
        .where('id', id)
        .first()
    },
    updateProject(knex, id, newProjectFields) {
      return knex('productify_projects')
        .where({ id })
        .update(newProjectFields)
    }
  }
  
  module.exports = ProjectsService;