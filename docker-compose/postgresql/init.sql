CREATE DATABASE connectors;
\c connectors;
CREATE TABLE connectors.public.elitetorrent (
  url_base varchar(150),
  url_movie varchar(150),
  image varchar(500) NOT NULL,
  CONSTRAINT image_pkey PRIMARY KEY (image),
  quality varchar(50),
  size varchar(50),
  title varchar(150),
  url_lang varchar(200),
  date_created timestamp NOT NULL DEFAULT current_timestamp
);

CREATE TABLE connectors.public.cinesa (
  cinesa_id varchar(20) NOT NULL,
  CONSTRAINT cinesa_id_pkey PRIMARY KEY (cinesa_id),
  base_url varchar(150),
  url_movie_path varchar(100),
  image varchar(250),
  title varchar(150),
  date_created timestamp NOT NULL DEFAULT current_timestamp
);

CREATE TABLE connectors.public.chollometro (
  guid varchar(200) NOT NULL,
  CONSTRAINT guid_pkey PRIMARY KEY (guid),
  base_url varchar(150),
  title varchar(150),
  url_chollo varchar(200),
  publish_date varchar(100),
  image varchar(250),
  merchant varchar(150),
  price varchar(50),
  content_snippet text,
  content text,
  categories jsonb,
  date_created timestamp NOT NULL DEFAULT current_timestamp
);