const app = require('../src/app');
const { getTestTasks } = require("./helper.js");
const knex = require('knex')

describe(`Tasks Router from productify_tasks `, function() {
    let db
    const testTasks = getTestTasks();
    
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
        return db.raw("ALTER TABLE productify_tasks DISABLE TRIGGER ALL;")
    });

    afterEach(() => {
        return db.raw("ALTER TABLE productify_tasks ENABLE TRIGGER ALL;")
    });
 
    describe(`Tasks when table is populated`, () => {

        beforeEach(() => {
            return db.into('productify_tasks')
                .insert(testTasks)
        });

        it(`fetches all tasks`, () => {
            return supertest(app)
                .get('/api/tasks')
                .expect(200, testTasks)
        })

        it(`deletes valid task`, () => {
            const taskToDelete = testTasks[0];
            const remainingTask = [testTasks[1]];
            return supertest(app)
                .delete(`/api/tasks/${taskToDelete.id}`)
                .expect(204, {})
                .then(res => {
                    supertest(app)
                        .get('/api/tasks')
                        .expect(200, remainingTask)
                })
        })

        it(`tries to delete non-existent task`, () => {
            return supertest(app)
                .delete(`/api/tasks/99`)
                .expect(404, {
                    error: { message: `Task doesn't exist` }
                })
        })

        it(`fetches specific task`, () => {
            const taskToFetch = testTasks[0];
            return supertest(app)
                .get(`/api/tasks/${taskToFetch.id}`)
                .expect(200, taskToFetch)
        })

        it(`tries to fetch non-existent task`, () => {
            return supertest(app)
            .get(`/api/tasks/99`)
            .expect(404, {
                error: { message: `Task doesn't exist` }
            })
        })

        it(`patches task with valid field`, () => {
            const taskToPatch = testTasks[0];
            const newName = "New Name";
            const expected = {...taskToPatch, task_name: newName }
            const newFields = {task_name: newName};
            return supertest(app)
            .patch(`/api/tasks/${taskToPatch.id}`)
            .send(newFields)
            .expect(204)
            .then(() => {
                supertest(app)
                .get(`/api/tasks/${taskToPatch.id}`)
                .then(res => {
                    expect(res.body).to.eql(expected)
                })
            })
        })

        it(`tries to patch task with invalid fields`, () => {
            const taskToPatch = testTasks[0];
            const newFields = {invalid: "invalid field"};
            return supertest(app)
            .patch(`/api/tasks/${taskToPatch.id}`)
            .send(newFields)
            .expect(400, {
                error: { message: "Request body must contain either 'task_name', 'description', 'deadline', 'status' or 'assignee'." }
            })
        })
    })
    
    describe(`Tasks when productify_tasks table is empty`, () => {

        it(`returns empty list when table is empty`, () => {
            return supertest(app)
                .get('/api/tasks')
                .expect(200, [])
        })

        it(`posts valid task`, () => {
            const newTask = testTasks[0];
            return supertest(app)
                .post('/api/tasks')
                .send(newTask)
                .expect(201)
                .expect(res => {
                    expect(res.body.id).to.eql(newTask.id)
                    expect(res.body.task_name).to.eql(newTask.task_name)
                    expect(res.body.assignee).to.eql(newTask.assignee)
                    expect(res.body.description).to.eql(newTask.description)
                    expect(res.body.project_id).to.eql(newTask.project_id)
                    expect(res.body.deadline).to.eql(newTask.deadline)
                    expect(res.body.status).to.eql(newTask.status)
                    expect(res.headers.location).to.eql(`/api/tasks/${res.body.id}`)
                })
                .then(res =>
                supertest(app)
                    .get(`/api/tasks/${res.body.id}`)
                    .expect(res.body)
                )
        })
        it(`posts invalid task entry`, () => {
            const invalidTask = {id:4};
            return supertest(app)
                .post('/api/tasks')
                .send(invalidTask)
                .expect(400)
        })
    })
})