DROP TABLE IF EXISTS productify_users_info;

CREATE TABLE productify_users_info (
    id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    team_id INTEGER REFERENCES productify_teams(id) ON DELETE CASCADE NOT NULL
);