DROP TABLE IF EXISTS productify_users_info;

CREATE TABLE productify_users_info (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    team_id TEXT REFERENCES productify_teams(id) ON DELETE CASCADE NOT NULL
);