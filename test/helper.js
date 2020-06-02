function getTestTeams(){
    return [
        {id: 0, team_name:'Best Team Ever'},
        {id: 1, team_name:'Rockstars'}
    ]
}

function getTestProjects() {
    return [
        {project_name: "First project", id:1, team_id: 1},
        {project_name:"Second project", id:2, team_id: 1},
    ]
}

function getTestUsersInfo() {
    return [
        {id:1, first_name: "Ada", last_name: "A", job_title:'UI designer', team_id: 1},
        {id:2, first_name:'Billie', last_name: "B", job_title:'Business lead', team_id: 1},
        {id:3, first_name:'Caroline', last_name: "C", job_title:'Project manager', team_id: 1},
    ]
}

module.exports = {
    getTestTeams,
    getTestProjects,
    getTestUsersInfo
}