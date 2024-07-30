--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

--
-- Name: community_infos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.community_infos (
    member_id uuid NOT NULL,
    apartment_number integer,
    block character varying(12),
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.community_infos OWNER TO postgres;

--
-- Name: condominium_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.condominium_members (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    role smallint DEFAULT '0'::smallint NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    unique_registry_id uuid NOT NULL,
    condominium_id uuid NOT NULL,
    user_id uuid
);


ALTER TABLE public.condominium_members OWNER TO postgres;

--
-- Name: condominium_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.condominium_requests (
    "user" uuid NOT NULL,
    condominium uuid NOT NULL,
    message character varying(320),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    condominium_id uuid NOT NULL,
    unique_registry_id uuid NOT NULL
);


ALTER TABLE public.condominium_requests OWNER TO postgres;

--
-- Name: condominiums; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.condominiums (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    human_readable_id character(6) NOT NULL,
    name character varying(120) NOT NULL,
    cep integer NOT NULL,
    num integer NOT NULL,
    cnpj bigint NOT NULL,
    reference character varying(60),
    district character varying(140) NOT NULL,
    city character varying(140) NOT NULL,
    state character varying(140) NOT NULL,
    complement character varying(60),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    owner_id uuid NOT NULL
);


ALTER TABLE public.condominiums OWNER TO postgres;

--
-- Name: migration_typeorm; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migration_typeorm (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migration_typeorm OWNER TO postgres;

--
-- Name: migration_typeorm_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migration_typeorm_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migration_typeorm_id_seq OWNER TO postgres;

--
-- Name: migration_typeorm_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migration_typeorm_id_seq OWNED BY public.migration_typeorm.id;


--
-- Name: unique_registries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unique_registries (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    cpf bigint,
    email character varying(320) NOT NULL
);


ALTER TABLE public.unique_registries OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(120) NOT NULL,
    phone_number bigint,
    password character(60) NOT NULL,
    tfa smallint DEFAULT '0'::smallint NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    unique_registry_id uuid NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: migration_typeorm id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migration_typeorm ALTER COLUMN id SET DEFAULT nextval('public.migration_typeorm_id_seq'::regclass);


--
-- Data for Name: community_infos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.community_infos (member_id, apartment_number, block, updated_at) FROM stdin;
\.


--
-- Data for Name: condominium_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.condominium_members (id, role, created_at, updated_at, unique_registry_id, condominium_id, user_id) FROM stdin;
\.


--
-- Data for Name: condominium_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.condominium_requests ("user", condominium, message, created_at, user_id, condominium_id, unique_registry_id) FROM stdin;
\.


--
-- Data for Name: condominiums; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.condominiums (id, human_readable_id, name, cep, num, cnpj, reference, district, city, state, complement, created_at, updated_at, owner_id) FROM stdin;
\.


--
-- Data for Name: migration_typeorm; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migration_typeorm (id, "timestamp", name) FROM stdin;
1	1712199170992	FirstMigration1712199170992
2	1712355043048	AddIndexAndFixForgottenNullablesFields1712355043048
\.


--
-- Data for Name: unique_registries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unique_registries (id, cpf, email) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, phone_number, password, tfa, created_at, updated_at, unique_registry_id) FROM stdin;
\.


--
-- Name: migration_typeorm_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migration_typeorm_id_seq', 2, true);


--
-- Name: condominium_members PK_condominium_members_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominium_members
    ADD CONSTRAINT "PK_condominium_members_id" PRIMARY KEY (id);


--
-- Name: condominium_requests PK_condominium_requests_user_id_condominium_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominium_requests
    ADD CONSTRAINT "PK_condominium_requests_user_id_condominium_id" PRIMARY KEY ("user", condominium);


--
-- Name: condominiums PK_condominiums_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominiums
    ADD CONSTRAINT "PK_condominiums_id" PRIMARY KEY (id);


--
-- Name: community_infos PK_edcaa78a36b9f80c7265576503b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_infos
    ADD CONSTRAINT "PK_edcaa78a36b9f80c7265576503b" PRIMARY KEY (member_id);


--
-- Name: migration_typeorm PK_fdd1922459cb0e2d08cf406ee1d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migration_typeorm
    ADD CONSTRAINT "PK_fdd1922459cb0e2d08cf406ee1d" PRIMARY KEY (id);


--
-- Name: unique_registries PK_unique_registry_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unique_registries
    ADD CONSTRAINT "PK_unique_registry_id" PRIMARY KEY (id);


--
-- Name: users PK_users_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_users_id" PRIMARY KEY (id);


--
-- Name: condominiums REL_6b78fa2df803ad0355ebe9c476; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominiums
    ADD CONSTRAINT "REL_6b78fa2df803ad0355ebe9c476" UNIQUE (owner_id);


--
-- Name: users REL_9a2c510fa5c6e0069f4bd406a1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "REL_9a2c510fa5c6e0069f4bd406a1" UNIQUE (unique_registry_id);


--
-- Name: condominium_members UQ_condominium_members_unique_registry_id_condominium_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominium_members
    ADD CONSTRAINT "UQ_condominium_members_unique_registry_id_condominium_id" UNIQUE (unique_registry_id, condominium_id);


--
-- Name: condominium_members UQ_condominium_members_user_id_condominium_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominium_members
    ADD CONSTRAINT "UQ_condominium_members_user_id_condominium_id" UNIQUE (user_id, condominium_id);


--
-- Name: condominium_requests UQ_condominium_requests_user_condominium_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominium_requests
    ADD CONSTRAINT "UQ_condominium_requests_user_condominium_id" UNIQUE ("user", condominium);


--
-- Name: condominiums UQ_condominiums_cep; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominiums
    ADD CONSTRAINT "UQ_condominiums_cep" UNIQUE (cep);


--
-- Name: condominiums UQ_condominiums_cnpj; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominiums
    ADD CONSTRAINT "UQ_condominiums_cnpj" UNIQUE (cnpj);


--
-- Name: condominiums UQ_condominiums_name; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominiums
    ADD CONSTRAINT "UQ_condominiums_name" UNIQUE (name);


--
-- Name: condominiums UQ_human_readable_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominiums
    ADD CONSTRAINT "UQ_human_readable_id" UNIQUE (human_readable_id);


--
-- Name: unique_registries UQ_unique_registries_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unique_registries
    ADD CONSTRAINT "UQ_unique_registries_email" UNIQUE (email);


--
-- Name: community_infos FK_community_infos_member_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_infos
    ADD CONSTRAINT "FK_community_infos_member_id" FOREIGN KEY (member_id) REFERENCES public.condominium_members(id) ON DELETE CASCADE;


--
-- Name: condominium_members FK_condominium_members_condominium_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominium_members
    ADD CONSTRAINT "FK_condominium_members_condominium_id" FOREIGN KEY (condominium_id) REFERENCES public.condominiums(id) ON DELETE CASCADE;


--
-- Name: condominium_members FK_condominium_members_unique_registry_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominium_members
    ADD CONSTRAINT "FK_condominium_members_unique_registry_id" FOREIGN KEY (unique_registry_id) REFERENCES public.unique_registries(id) ON DELETE CASCADE;


--
-- Name: condominium_members FK_condominium_members_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominium_members
    ADD CONSTRAINT "FK_condominium_members_user_id" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: condominium_requests FK_condominium_requests_condominium_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominium_requests
    ADD CONSTRAINT "FK_condominium_requests_condominium_id" FOREIGN KEY (condominium_id) REFERENCES public.condominiums(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: condominium_requests FK_condominium_requests_unique_registry_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominium_requests
    ADD CONSTRAINT "FK_condominium_requests_unique_registry_id" FOREIGN KEY (unique_registry_id) REFERENCES public.unique_registries(id) ON DELETE CASCADE;


--
-- Name: condominium_requests FK_condominium_requests_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominium_requests
    ADD CONSTRAINT "FK_condominium_requests_user_id" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: condominiums FK_condominiums_owner_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominiums
    ADD CONSTRAINT "FK_condominiums_owner_id" FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users FK_users_registry_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_users_registry_id" FOREIGN KEY (unique_registry_id) REFERENCES public.unique_registries(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

