const app = require('../src/app');
const TeamsService = require('../src/users/teams-service');
const { getTestTeams } = require("./helper.js");
const knex = require('knex')

describe(`Teams service object`, function() {
    let db
    const testTeams = getTestTeams();
    console.log(testTeams);
    
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
    });

    before(() => {
        knex.raw('TRUNCATE TABLE productify_teams CASCADE')
    })

    beforeEach('Clean the table', () => db.raw('TRUNCATE productify_tasks, productify_users_login, productify_users_info, productify_projects, productify_teams RESTART IDENTITY CASCADE'))

    after(() => db.destroy())

    describe(`Teams when productify_team table is populated`, () => {

        beforeEach(() => {
            return db
                .into('productify_teams')
                .insert(testTeams)
        });

        it(`resolves all teams from 'productify_teams' table`, () => {
            return TeamsService.getAllTeams(db)
                .then(actual => {
                    expect(actual).to.eql(testTeams)
            })
        })
    });
    
    describe(`Teams when productify_team table is empty`, () => {

        it(`returns empty list from 'productify_teams' table`, () => {
            return TeamsService.getAllTeams(db)
                .then(actual => {
                    expect(actual).to.eql([])
            })
        })
    });
})