CREATE TABLE public."roles"
(
  id integer PRIMARY KEY,
  title character varying(255) NOT NULL,
  read boolean DEFAULT false,
  write boolean DEFAULT false,
  delete boolean DEFAULT false
  createdAt timestamp with time zone NOT NULL,
  updatedAt timestamp with time zone NOT NULL
);

CREATE TABLE public."users"
(
  id integer PRIMARY KEY,
  fullNames character varying(255) NOT NULL,
  email character varying(255) NOT NULL,
  username character varying(255) NOT NULL,
  password character varying(255) NOT NULL,
  createdAt timestamp with time zone NOT NULL,
  updatedAt timestamp with time zone NOT NULL,
  roleId integer REFERENCES "roles" ON DELETE CASCADE DEFAULT 2
);

CREATE TABLE public."documents"
(
  id integer PRIMARY KEY,
  title character varying(255) NOT NULL,
  content text NOT NULL,
  permission boolean DEFAULT false,
  createdAt timestamp with time zone NOT NULL,
  updatedAt timestamp with time zone NOT NULL,
  roleId integer REFERENCES "roles" ON DELETE CASCADE,
  OwnerId integer REFERENCES "users" ON DELETE CASCADE
);
