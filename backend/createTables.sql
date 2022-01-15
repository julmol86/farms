create table farm(
  id SERIAL PRIMARY KEY,
  farmname VARCHAR(100) NOT NULL UNIQUE,
  longitude NUMERIC(15,10),
  latitude NUMERIC(15,10)
);

create table farmdata(
  id BIGSERIAL PRIMARY KEY,
  farm_id INTEGER NOT NULL REFERENCES farm(id),
  datetimestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  metrictype VARCHAR(11) NOT NULL,
  metricvalue NUMERIC(5,2) NOT NULL
);

create table filesuploaded(
  id SERIAL PRIMARY KEY,
  filename VARCHAR(100) NOT NULL UNIQUE,
  createstamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

create table farmuser(
  id BIGSERIAL PRIMARY KEY,
  farm_id INTEGER NOT NULL REFERENCES farm(id),
  login VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);
