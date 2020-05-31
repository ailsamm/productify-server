const TasksService = {
    getAllTasks(knex) {
      return knex.select('*').from('productify_tasks')
    },
    insertTask(knex, newTask){
      return knex
          .insert(newTask)
          .into('productify_tasks')
          .returning('*')
          .then(rows => {
            console.log(rows)
            return rows[0]
      })
    },
    deleteTask(knex, id){
      return knex('productify_tasks')
          .where({ id })
          .delete()
    },
    getById(knex, id){
      return knex
        .from('productify_tasks')
        .select('*')
        .where('id', id)
        .first()
    },
    updateTask(knex, id, newTaskFields) {
      return knex('productify_tasks')
        .where({ id })
        .update(newTaskFields)
    }
  }
  
  module.exports = TasksService;