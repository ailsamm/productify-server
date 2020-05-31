const UsersInfoService = {
  getAllUsers(knex) {
    return knex.select('*').from('productify_users_info')
  },
  insertUser(knex, newUser){
    return knex
        .insert(newUser)
        .into('productify_users_info')
        .returning('*')
        .then(rows => {
          console.log(rows)
          return rows[0]
    })
  },
  deleteUser(knex, id){
    return knex('productify_users_info')
        .where({ id })
        .delete()
  },
  getById(knex, id){
    return knex
      .from('productify_users_info')
      .select('*')
      .where('id', id)
      .first()
  },
  updateUser(knex, id, newUserFields) {
    return knex('productify_users_info')
      .where({ id })
      .update(newUserFields)
  }
}

module.exports = UsersInfoService