const app = require('../src/app');
const { getTestProjects } = require("./helper.js");
const knex = require('knex')

describe.only(`Projects Router from productify_projects`, function() {
    let db
    const testProjects = getTestProjects();
    
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db);
    });

    beforeEach('Clean the table', () => db.raw('TRUNCATE productify_tasks, productify_users_login, productify_users_info, productify_projects, productify_teams RESTART IDENTITY CASCADE'))

    after(() => db.destroy())

    beforeEach(() => {
        return db.raw("ALTER TABLE productify_projects DISABLE TRIGGER ALL;")
    });

    afterEach(() => {
        return db.raw("ALTER TABLE productify_projects ENABLE TRIGGER ALL;")
    });

    describe(`Projects when table is populated`, () => {

        beforeEach(() => {
            return db.into('productify_projects')
                .insert(testProjects)
        });

        it(`fetches all projects`, () => {
            return supertest(app)
                .get('/api/projects')
                .expect(200, testProjects)
        })

        it(`deletes valid project`, () => {
            const projectToDelete = testProjects[0];
            const remainingProject = [testProjects[1]];
            return supertest(app)
                .delete(`/api/projects/${projectToDelete.id}`)
                .expect(204, {})
                .then(res => {
                    supertest(app)
                        .get('/api/projects')
                        .expect(200, remainingProject)
                })
        })

        it(`tries to delete non-existent project`, () => {
            return supertest(app)
                .delete(`/api/projects/99`)
                .expect(404, {
                    error: { message: `Project doesn't exist` }
                })
        })

        it(`fetches specific project`, () => {
            const projectToFetch = testProjects[0];
            return supertest(app)
                .get(`/api/projects/${projectToFetch.id}`)
                .expect(200, projectToFetch)
        })

        it(`tries to fetch non-existent project`, () => {
            return supertest(app)
            .get(`/api/projects/99`)
            .expect(404, {
                error: { message: `Project doesn't exist` }
            })
        })

        it(`patches project with valid field`, () => {
            const projectToPatch = testProjects[0];
            const newName = "New Name";
            const expected = {...projectToPatch, project_name: newName }
            const newFields = {project_name: newName};
            return supertest(app)
            .patch(`/api/projects/${projectToPatch.id}`)
            .send(newFields)
            .expect(204)
            .then(() => {
                supertest(app)
                .get(`/api/projects/${projectToPatch.id}`)
                .then(res => {
                    expect(res.body).to.eql(expected)
                })
            })
        })

        it(`tries to patch project with invalid fields`, () => {
            const projectToPatch = testProjects[0];
            const newFields = {invalid: "invalid field"};
            return supertest(app)
            .patch(`/api/projects/${projectToPatch.id}`)
            .expect(400, {
                error: { message: "Request body must contain 'project_name'" }
            })
        })
    })
    
    describe(`Projects when productify_project table is empty`, () => {

        beforeEach('Clean the table', () => db.raw('TRUNCATE productify_tasks, productify_users_login, productify_users_info, productify_projects, productify_teams RESTART IDENTITY CASCADE'))

        it(`returns empty list when table is empty`, () => {
            return supertest(app)
                .get('/api/projects')
                .expect(200, [])
        })

        it(`posts valid project`, () => {
            const newProject = testProjects[0];
            console.log(newProject)
            return supertest(app)
                .post('/api/projects')
                .send(newProject)
                .expect(201)
                .expect(res => {
                    expect(res.body.id).to.eql(newProject.id)
                    expect(res.body.project_name).to.eql(newProject.project_name)
                    expect(res.headers.location).to.eql(`/api/projects/${res.body.id}`)
                })
                .then(res =>
                supertest(app)
                    .get(`/api/projects/${res.body.id}`)
                    .expect(res.body)
                )
        })
        it(`posts invalid project entry`, () => {
            const invalidProject = {id:4};
            return supertest(app)
                .post('/api/projects')
                .send(invalidProject)
                .expect(400)
        })
    })
})