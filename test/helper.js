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

module.exports = {
    getTestTeams,
    getTestProjects
}