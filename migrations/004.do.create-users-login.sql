DROP TABLE IF EXISTS productify_users_login;

CREATE TABLE productify_users_login (
    userId INTEGER REFERENCES productify_users_info(id) ON DELETE CASCADE NOT NULL,
    emailAddress TEXT NOT NULL,
    password TEXT NOT NULL
);