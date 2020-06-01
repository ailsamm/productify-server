DROP TABLE IF EXISTS productify_tasks;

CREATE TABLE productify_tasks (
    id INTEGER PRIMARY KEY,
    task_name TEXT NOT NULL,
    project_id INTEGER REFERENCES productify_projects(id) ON DELETE CASCADE NOT NULL,
    description TEXT,
    deadline TEXT,
    status TEXT NOT NULL,
    assignee INTEGER REFERENCES productify_users_info(id) ON DELETE CASCADE
);
