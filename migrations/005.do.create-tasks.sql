DROP TABLE IF EXISTS productify_tasks;

CREATE TABLE productify_tasks (
    id TEXT PRIMARY KEY,
    task_name TEXT NOT NULL,
    project_id TEXT REFERENCES productify_projects(id) ON DELETE CASCADE NOT NULL,
    description TEXT,
    deadline TEXT,
    status TEXT NOT NULL,
    assignee TEXT REFERENCES productify_users_info(id) ON DELETE CASCADE
);
