DROP TABLE IF EXISTS productify_users_login;

CREATE TABLE productify_users_login (
    user_id INTEGER REFERENCES productify_users_info(id) ON DELETE CASCADE NOT NULL,
    email_address TEXT NOT NULL,
    password TEXT NOT NULL
);