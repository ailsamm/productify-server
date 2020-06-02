const app = require('../src/app');
const { getTestUsersLogin } = require("./helper.js");
const knex = require('knex')

describe(`UsersLogin Router from productify_users_login `, function() {
    let db
    const testUsersLogin = getTestUsersLogin();
    
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db);
    });

    beforeEach('Clean the table', () => db.raw('TRUNCATE productify_tasks, productify_users_login, productify_users_info, productify_users_login , productify_teams RESTART IDENTITY CASCADE'))

    after(() => db.destroy())

    beforeEach(() => {
        return db.raw("ALTER TABLE productify_users_login DISABLE TRIGGER ALL;")
    });

    afterEach(() => {
        return db.raw("ALTER TABLE productify_users_login  ENABLE TRIGGER ALL;")
    });
 
    describe(`UsersLogin when table is populated`, () => {

        beforeEach(() => {
            return db.into('productify_users_login')
                .insert(testUsersLogin)
        });

        it(`fetches all users`, () => {
            return supertest(app)
                .get('/api/users-login')
                .expect(200, testUsersLogin)
        })

        it(`deletes valid user`, () => {
            const userToDelete = testUsersLogin[0];
            const remainingUser = testUsersLogin.filter(user => user.user_id !== userToDelete.user_id);
            return supertest(app)
                .delete(`/api/users-login/${userToDelete.user_id}`)
                .expect(204, {})
                .then(res => {
                    supertest(app)
                        .get('/api/users-login')
                        .expect(200, remainingUser)
                })
        })

        it(`tries to delete non-existent user`, () => {
            return supertest(app)
                .delete(`/api/users-login/99`)
                .expect(404, {
                    error: { message: `User doesn't exist` }
                })
        })

        it(`fetches specific user`, () => {
            const userToFetch = testUsersLogin[0];
            return supertest(app)
                .get(`/api/users-login/${userToFetch.user_id}`)
                .expect(200, userToFetch)
        })

        it(`tries to fetch non-existent user`, () => {
            return supertest(app)
            .get(`/api/users-login/99`)
            .expect(404, {
                error: { message: `User doesn't exist` }
            })
        })
    })
    
    describe(`UsersLogin when productify_users_login table is empty`, () => {

        it(`returns empty list when table is empty`, () => {
            return supertest(app)
                .get('/api/users-login')
                .expect(200, [])
        })

        it(`posts valid user`, () => {
            const newUser = testUsersLogin[0];
            return supertest(app)
                .post('/api/users-login')
                .send(newUser)
                .expect(201)
                .expect(res => {
                    expect(res.body.user_id).to.eql(newUser.user_id)
                    expect(res.body.first_name).to.eql(newUser.first_name)
                    expect(res.body.last_name).to.eql(newUser.last_name)
                    expect(res.headers.location).to.eql(`/api/users-login/${res.body.user_id}`)
                })
                .then(res =>
                supertest(app)
                    .get(`/api/users-login/${res.body.user_id}`)
                    .expect(res.body)
                )
        })
        it(`posts invalid user entry`, () => {
            const invalidUser = {id:4};
            return supertest(app)
                .post('/api/users-login')
                .send(invalidUser)
                .expect(400)
        })
    })
})