INSERT INTO productify_tasks (id, project_id, task_name, description, deadline, status, assignee)
VALUES
    (1, 1, 'Add time tracking components', 'blah...', '2020-06-30T19:29:21.212Z', 'backlog', 2),
    (2, 1, 'Deploy app', 'blah...', '2020-06-29T19:29:21.212Z', 'backlog', 1),
    (3, 1, 'Set up server', 'blah...', '2020-06-06T19:29:21.212Z', 'inProgress', 3),
    (4, 1, 'Create endpoints', 'blah...', '2020-06-10T19:29:21.212Z', 'inReview', 4),
    (5, 1, 'Add CRUD functionality', 'blah...', '2020-06-25T19:29:21.212Z', 'complete', 6),
    (6, 2, 'Make endpoints protected', 'blah...', '2020-06-21T19:29:21.212Z', 'complete', 5),
    (7, 2, 'Test with small group', 'blah...', '2020-06-20T19:29:21.212Z', 'backlog', 1),
    (8, 2, 'Add animations to UI', 'blah...', '2020-06-10T19:29:21.212Z', 'inProgress', 2);
