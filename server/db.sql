CREATE TABLE users (
  id uuid primary key default uuid_generate_v4(),
  username varchar (50) unique not null,
  password varchar (50) not null,
  email varchar (255) unique not null,
  created_on timestamp not null,
  last_login timestamp
);


CREATE TABLE user_rights (
  user_id uuid primary key unique not null,
  rights_id integer NOT NULL
);

--manual entry
INSERT INTO users (username, password, email, created_on) VALUES ('Jonathan','jojo','jojo@gmail.com',NOW());

--tables for translation
CREATE TABLE trans_text (
  id SERIAL PRIMARY KEY,
  data jsonb,
  trans_desc_id INTEGER NOT NULL,
  FOREIGN KEY (trans_desc_id) REFERENCES trans_desc (id)
);

CREATE TABLE trans_desc (
  id SERIAL PRIMARY KEY,
  username_id uuid NOT NULL,
  language_id integer NOT NULL,
  is_main_trans boolean not null,
  name varchar(50) NOT NULL,
  FOREIGN KEY (username_id) REFERENCES users (id),
  FOREIGN KEY (language_id) REFERENCES languages (id),
  UNIQUE(language_id, is_main_trans),
  UNIQUE(username_id, name)
);

SELECT trans_text.data
FROM trans_text
LEFT JOIN trans_desc
ON trans_text.trans_desc_id = trans_desc.id
WHERE trans_desc.is_main_trans
AND trans_desc.language_id =
(SELECT id FROM languages WHERE name = 'French' );

INSERT INTO trans_desc (username_id, language_id, is_main_trans, name) VALUES ((SELECT id from users where username = 'JuNaShan'), 1, TRUE, 'Original');

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

CREATE TABLE trans_shaping (
  id serial primary key,
  data jsonb,
  trans_desc_id integer,
  language_id integer,
  FOREIGN KEY (language_id) REFERENCES languages (id),
  FOREIGN KEY (trans_desc_id) REFERENCES trans_desc (id)
);


CREATE TABLE blobtest (
  id serial primary key,
  sentence_id integer,
  data bytea,
  trans_desc_id integer,
  username_id uuid NOT NULL,
  FOREIGN KEY (trans_desc_id) REFERENCES trans_desc (id),
  FOREIGN KEY (username_id) REFERENCES users (id),
  UNIQUE(trans_desc_id, sentence_id, username_id)
);

CREATE TABLE discarded_audio (
  id serial primary key,
  sentence_id integer,
  data bytea,
  trans_desc_id integer,
  username_id uuid NOT NULL,
  FOREIGN KEY (trans_desc_id) REFERENCES trans_desc (id),
  FOREIGN KEY (username_id) REFERENCES users (id),
  UNIQUE(trans_desc_id, sentence_id, username_id)
);

CREATE TABLE pictures (
  id serial primary key,
  image_id integer,
  text_before_id integer,
  link varchar
);

CREATE TABLE issue_log (
  id serial primary key,
  username_id uuid NOT NULL,
  created_on timestamp not null,
  status varchar,
  type varchar,
  subtype varchar,
  comment varchar,
  trans_desc_id integer,
  sentence_id integer,
  audio_username_id uuid,
  CONSTRAINT uk_issue_log CHECK
  (
    type <> 'AUDIO'  OR audio_username_id IS NOT NULL
  ),
  FOREIGN KEY (trans_desc_id) REFERENCES trans_desc (id),
  FOREIGN KEY (username_id) REFERENCES users (id)
);

CREATE TABLE notifications (
  id serial primary key,
  username_id uuid NOT NULL,
  created_on timestamp not null,
  type VARCHAR,
  subtype VARCHAR,
  message VARCHAR,
  viewed BOOLEAN,
  FOREIGN KEY (username_id) REFERENCES users (id)
)

CREATE TABLE email_verification (
  id serial primary key,
  username_id uuid NOT NULL,
  is_verified BOOLEAN,
  FOREIGN KEY (username_id) REFERENCES users (id)
);
