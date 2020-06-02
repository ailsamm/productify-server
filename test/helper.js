const moment = require('moment');

function getTestTeams(){
    return [
        {id: 0, team_name:'Best Team Ever'},
        {id: 1, team_name:'Rockstars'}
    ]
}

function getTestProjects() {
    return [
        {project_name: "First project", id:1, team_id: 1},
        {project_name:"Second project", id:2, team_id: 1}
    ]
}

function getTestUsersInfo() {
    return [
        {id:1, first_name: "Ada", last_name: "A", job_title:'UI designer', team_id: 1},
        {id:2, first_name:'Billie', last_name: "B", job_title:'Business lead', team_id: 1},
        {id:3, first_name:'Caroline', last_name: "C", job_title:'Project manager', team_id: 1}
    ]
}

function getTestUsersLogin() {
    return [
        {user_id: 1, email_address: "aaa@gmail.com", password: "aaa"},
        {user_id: 2, email_address: "bbb@gmail.com", password: "bbb"},
        {user_id: 3, email_address: "ccc@gmail.com", password: "ccc"}
    ]
}

function getTestTasks() {
    return [
        {id:1, project_id:1, task_name:'Add time tracking components', description:'blah...', deadline: moment().toISOString(), status:'backlog', assignee:2},
        {id:2, project_id:1, task_name:'Deploy app', description:'blah...', deadline: moment().toISOString(), status:'backlog', assignee:1},
        {id:3, project_id:1, task_name:'Set up server', description:'blah...', deadline: moment().toISOString(), status:'inProgress', assignee:3}
    ]
}

module.exports = {
    getTestTeams,
    getTestProjects,
    getTestUsersInfo,
    getTestUsersLogin,
    getTestTasks
}