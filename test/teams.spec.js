const app = require('../src/app');
const { getTestTeams } = require("./helper.js");
const knex = require('knex');

describe(`Teams Router from productify_teams`, function() {
    let db;
    const testTeams = getTestTeams();
    
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });

    beforeEach('Clean the table', () => db.raw('TRUNCATE productify_tasks, productify_users_login, productify_users_info, productify_projects, productify_teams RESTART IDENTITY CASCADE'));

    after(() => db.destroy());

    describe(`Teams when table is populated`, () => {

        beforeEach(() => {
            return db
                .into('productify_teams')
                .insert(testTeams)
        });

        it(`fetches all teams`, () => {
            return supertest(app)
                .get('/api/teams')
                .expect(200, testTeams)
        });

        it(`deletes valid team`, () => {
            const teamToDelete = testTeams[0];
            const remainingTeam = [testTeams[1]];
            return supertest(app)
                .delete(`/api/teams/${teamToDelete.id}`)
                .expect(204, {})
                .then(res => {
                    supertest(app)
                        .get('/api/teams')
                        .expect(200, remainingTeam)
                });
        });

        it(`tries to delete non-existent team`, () => {
            return supertest(app)
                .delete(`/api/teams/99`)
                .expect(404, {
                    error: { message: `Team doesn't exist` }
                });
        });

        it(`fetches specific team`, () => {
            const teamToFetch = testTeams[0];
            return supertest(app)
                .get(`/api/teams/${teamToFetch.id}`)
                .expect(200, teamToFetch)
        });

        it(`tries to fetch non-existent team`, () => {
            return supertest(app)
            .get(`/api/teams/99`)
            .expect(404, {
                error: { message: `Team doesn't exist` }
            });
        });

        it(`patches team with valid field`, () => {
            const teamToPatch = testTeams[0];
            const newName = "New Name";
            const expected = {id: teamToPatch.id, team_name: newName }
            const newFields = {team_name: newName};
            return supertest(app)
            .patch(`/api/teams/${teamToPatch.id}`)
            .send(newFields)
            .expect(204)
            .then(() => {
                supertest(app)
                .get(`/api/teams/${teamToPatch.id}`)
                .then(res => {
                    expect(res.body).to.eql(expected)
                });
            });
        });

        it(`tries to patch team with invalid fields`, () => {
            const teamToPatch = testTeams[0];
            const newFields = {invalid: "invalid field"};
            return supertest(app)
            .patch(`/api/teams/${teamToPatch.id}`)
            .expect(400, {
                error: { message: "Request body must contain 'team_name'" }
            });
        });
    });
    
    describe(`Teams when productify_team table is empty`, () => {

        it(`returns empty list when table is empty`, () => {
            return supertest(app)
                .get('/api/teams')
                .expect(200, [])
        });

        it(`posts valid team`, () => {
            const newTeam = testTeams[0];
            return supertest(app)
                .post('/api/teams')
                .send(newTeam)
                .expect(201)
                .expect(res => {
                    expect(res.body.id).to.eql(newTeam.id)
                    expect(res.body.team_name).to.eql(newTeam.team_name)
                    expect(res.headers.location).to.eql(`/api/teams/${res.body.id}`)
                })
                .then(res =>
                supertest(app)
                    .get(`/api/teams/${res.body.id}`)
                    .expect(res.body)
                )
        });
        it(`posts invalid team entry`, () => {
            const invalidTeam = {id:4};
            return supertest(app)
                .post('/api/teams')
                .send(invalidTeam)
                .expect(400)
        });
    });
});