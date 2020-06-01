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
    deleteUser(knex, user_id){
      return knex('productify_users_login')
          .where({ user_id })
          .delete()
    },
    getById(knex, user_id){
      return knex
        .from('productify_users_login')
        .select('*')
        .where({ user_id })
        .first()
    },
    updateUser(knex, user_id, newUserFields) {
      return knex('productify_users_login')
        .where({ user_id })
        .update(newUserFields)
    }
  }
  
  module.exports = UsersLoginService