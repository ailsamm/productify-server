const UsersLoginService = {
    getAllUsers(knex) {
      return knex.select('*').from('productify_users_login')
    },
    insertUser(knex, newUser){
      return knex
          .insert(newUser)
          .into('productify_users_login')
          .returning('*')
          .then(rows => {
            return rows[0]
      })
    },
    deleteUser(knex, id){
      return knex('productify_users_login')
          .where({ id })
          .delete()
    },
    getById(knex, id){
      return knex
        .from('productify_users_login')
        .select('*')
        .where('id', id)
        .first()
    },
    updateUser(knex, id, newUserFields) {
      return knex('productify_users_login')
        .where({ id })
        .update(newUserFields)
    }
  }
  
  module.exports = UsersLoginService