const app = require('../src/app');
const { getTestUsersInfo } = require("./helper.js");
const knex = require('knex')

describe(`UsersInfo Router from productify_users_info `, function() {
    let db
    const testUsersInfo = getTestUsersInfo();
    
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db);
    });

    beforeEach('Clean the table', () => db.raw('TRUNCATE productify_tasks, productify_users_login, productify_users_info, productify_projects , productify_teams RESTART IDENTITY CASCADE'))

    after(() => db.destroy())

    beforeEach(() => {
        return db.raw("ALTER TABLE productify_users_info DISABLE TRIGGER ALL;")
    });

    afterEach(() => {
        return db.raw("ALTER TABLE productify_users_info  ENABLE TRIGGER ALL;")
    });
 
    describe(`UsersInfo when table is populated`, () => {

        beforeEach(() => {
            return db.into('productify_users_info')
                .insert(testUsersInfo)
        });

        it(`fetches all users`, () => {
            return supertest(app)
                .get('/api/users-info')
                .expect(200, testUsersInfo)
        })

        it(`deletes valid user`, () => {
            const userToDelete = testUsersInfo[0];
            const remainingUser = [testUsersInfo[1]];
            return supertest(app)
                .delete(`/api/users-info/${userToDelete.id}`)
                .expect(204, {})
                .then(res => {
                    supertest(app)
                        .get('/api/users-info')
                        .expect(200, remainingUser)
                })
        })

        it(`tries to delete non-existent user`, () => {
            return supertest(app)
                .delete(`/api/users-info/99`)
                .expect(404, {
                    error: { message: `User doesn't exist` }
                })
        })

        it(`fetches specific user`, () => {
            const userToFetch = testUsersInfo[0];
            return supertest(app)
                .get(`/api/users-info/${userToFetch.id}`)
                .expect(200, userToFetch)
        })

        it(`tries to fetch non-existent user`, () => {
            return supertest(app)
            .get(`/api/users-info/99`)
            .expect(404, {
                error: { message: `User doesn't exist` }
            })
        })

        it(`patches user with valid field`, () => {
            const userToPatch = testUsersInfo[0];
            const newName = "New Name";
            const expected = {...userToPatch, first_name: newName }
            const newFields = {first_name: newName};
            return supertest(app)
            .patch(`/api/users-info/${userToPatch.id}`)
            .send(newFields)
            .expect(204)
            .then(() => {
                supertest(app)
                .get(`/api/users-info/${userToPatch.id}`)
                .then(res => {
                    expect(res.body).to.eql(expected)
                })
            })
        })

        it(`tries to patch user with invalid fields`, () => {
            const userToPatch = testUsersInfo[0];
            const newFields = {invalid: "invalid field"};
            return supertest(app)
            .patch(`/api/users-info/${userToPatch.id}`)
            .expect(400, {
                error: { message: "Request body must contain either 'first_name', 'last_name', 'job_title' or 'team_id'" }
            })
        })
    })
    
    describe(`UsersInfo when productify_users_info table is empty`, () => {

        beforeEach('Clean the table', () => db.raw('TRUNCATE productify_tasks, productify_users_login, productify_users_info, productify_users_info , productify_teams RESTART IDENTITY CASCADE'))

        it(`returns empty list when table is empty`, () => {
            return supertest(app)
                .get('/api/users-info')
                .expect(200, [])
        })

        it(`posts valid user`, () => {
            const newUser = testUsersInfo[0];
            return supertest(app)
                .post('/api/users-info')
                .send(newUser)
                .expect(201)
                .expect(res => {
                    expect(res.body.id).to.eql(newUser.id)
                    expect(res.body.first_name).to.eql(newUser.first_name)
                    expect(res.body.last_name).to.eql(newUser.last_name)
                    expect(res.headers.location).to.eql(`/api/users-info/${res.body.id}`)
                })
                .then(res =>
                supertest(app)
                    .get(`/api/users-info/${res.body.id}`)
                    .expect(res.body)
                )
        })
        it(`posts invalid user entry`, () => {
            const invalidUser = {id:4};
            return supertest(app)
                .post('/api/users-info')
                .send(invalidUser)
                .expect(400)
        })
    })
})