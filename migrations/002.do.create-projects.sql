DROP TABLE IF EXISTS productify_projects;

CREATE TABLE productify_projects (
    id TEXT PRIMARY KEY,
    project_name TEXT NOT NULL, 
    team_id TEXT REFERENCES productify_teams(id) ON DELETE CASCADE NOT NULL
);