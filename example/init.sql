CREATE EXTENSION pgcrypto WITH SCHEMA public;

CREATE TABLE public.condominiumreluser (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    block character varying(6),
    apartment_number integer,
    level smallint DEFAULT '0'::smallint NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    condominium_id uuid NOT NULL,
    user_id uuid NOT NULL
);

CREATE TABLE public.condominiums (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(120) NOT NULL,
    cep character(8) NOT NULL,
    num integer NOT NULL,
    cnpj character(14) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.invites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(320) NOT NULL,
    ttl integer NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    type smallint DEFAULT '0'::smallint NOT NULL,
    condominium_id uuid NOT NULL
);

CREATE TABLE public.migration_typeorm (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);

CREATE SEQUENCE public.migration_typeorm_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(120) NOT NULL,
    email character varying(320) NOT NULL,
    password character varying(64) NOT NULL,
    cpf character(11) NOT NULL,
    phone_number character varying(30) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.migration_typeorm ALTER COLUMN id SET DEFAULT nextval('public.migration_typeorm_id_seq'::regclass);

ALTER TABLE ONLY public.condominiumreluser
    ADD CONSTRAINT "PK_40607eedbb820f15dc369121ef8" PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


ALTER TABLE ONLY public.invites
    ADD CONSTRAINT "PK_aa52e96b44a714372f4dd31a0af" PRIMARY KEY (id);

ALTER TABLE ONLY public.condominiums
    ADD CONSTRAINT "PK_bb7509828f6270f35097b88e752" PRIMARY KEY (id);

ALTER TABLE ONLY public.migration_typeorm
    ADD CONSTRAINT "PK_fdd1922459cb0e2d08cf406ee1d" PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_230b925048540454c8b4c481e1c" UNIQUE (cpf);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf" UNIQUE (name);

ALTER TABLE ONLY public.condominiums
    ADD CONSTRAINT "UQ_72b384c406b4575f20c517d20f5" UNIQUE (cnpj);

ALTER TABLE ONLY public.invites
    ADD CONSTRAINT "UQ_91a0c4378ab8d63d8011022960f" UNIQUE (email, condominium_id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);

ALTER TABLE ONLY public.condominiums
    ADD CONSTRAINT "UQ_9c660cb468b8f0d455724033e95" UNIQUE (name);

ALTER TABLE ONLY public.condominiums
    ADD CONSTRAINT "UQ_b99ec9dd3af9021583ac55b2311" UNIQUE (cep);

ALTER TABLE ONLY public.condominiumreluser
    ADD CONSTRAINT "UQ_db9b0e0359d3ef2acd7bff9a97e" UNIQUE (user_id, condominium_id);

ALTER TABLE ONLY public.invites
    ADD CONSTRAINT "FK_42d7aa59cf29836a127e7391d7b" FOREIGN KEY (condominium_id) REFERENCES public.condominiums(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.condominiumreluser
    ADD CONSTRAINT "FK_660e1c8364970ef96b8b3ef527f" FOREIGN KEY (condominium_id) REFERENCES public.condominiums(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.condominiumreluser
    ADD CONSTRAINT "FK_73df2b389daddcf79c09ce57f8e" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

