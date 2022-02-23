CREATE TABLE users (
  id uuid primary key default uuid_generate_v4(),
  username varchar (50) unique not null,
  password varchar (50) not null,
  email varchar (255) unique not null,
  created_on timestamp not null,
  last_login timestamp
);

--manual entry
INSERT INTO users (username, password, email, created_on) VALUES ('Jonathan','jojo','jojo@gmail.com',NOW());

--table for translation
CREATE TABLE translations (
  id uuid primary key default uuid_generate_v4(),
  username_id uuid,
  language_id integer,
  trans_id int,
  trans_text varchar,
  FOREIGN KEY (username_id) REFERENCES users (id),
  FOREIGN KEY (language_id) REFERENCES languages (id),
)

CREATE TABLE languages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50)
)

CREATE TABLE drafts (
  id serial primary key,
  username_id uuid,
  language_id integer,
  data jsonb,
  created_on timestamp not null,
  last_modified timestamp,
  name varchar(255),
  FOREIGN KEY (username_id) REFERENCES users (id),
  FOREIGN KEY (language_id) REFERENCES languages (id)
)
