--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Debian 16.2-1.pgdg120+2)
-- Dumped by pg_dump version 16.1

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

--
-- Name: community_infos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.community_infos (
    member_id uuid NOT NULL,
    apartment_number integer NOT NULL,
    block character varying(6) NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.community_infos OWNER TO postgres;

--
-- Name: condominium_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.condominium_members (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    condominium_id uuid NOT NULL,
    user_id uuid,
    role smallint DEFAULT '0'::smallint NOT NULL,
    unique_registry_id uuid NOT NULL
);


ALTER TABLE public.condominium_members OWNER TO postgres;

--
-- Name: condominiums; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.condominiums (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(120) NOT NULL,
    cep integer NOT NULL,
    num integer NOT NULL,
    cnpj bigint NOT NULL,
    seed_key character varying(60) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    owner_id uuid NOT NULL
);


ALTER TABLE public.condominiums OWNER TO postgres;

--
-- Name: enterprise_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enterprise_members (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    cpf bigint NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    condominium_id uuid NOT NULL
);


ALTER TABLE public.enterprise_members OWNER TO postgres;

--
-- Name: invites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invites (
    recipient character varying(320) NOT NULL,
    code character varying(60) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    condominium_id uuid NOT NULL,
    member_id uuid NOT NULL,
    member character varying NOT NULL
);


ALTER TABLE public.invites OWNER TO postgres;

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

COPY public.condominium_members (id, created_at, updated_at, condominium_id, user_id, role, unique_registry_id) FROM stdin;
\.


--
-- Data for Name: condominiums; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.condominiums (id, name, cep, num, cnpj, seed_key, created_at, updated_at, owner_id) FROM stdin;
\.


--
-- Data for Name: enterprise_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enterprise_members (id, cpf, created_at, updated_at, user_id, condominium_id) FROM stdin;
\.


--
-- Data for Name: invites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invites (recipient, code, created_at, condominium_id, member_id, member) FROM stdin;
\.


--
-- Data for Name: migration_typeorm; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migration_typeorm (id, "timestamp", name) FROM stdin;
1	1709706321663	Migrations1709706321663
2	1710480251681	AddUniqueRegistries1710480251681
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
-- Name: condominium_members PK_6ff037a5659872d22b490adb2c9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominium_members
    ADD CONSTRAINT "PK_6ff037a5659872d22b490adb2c9" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: condominiums PK_bb7509828f6270f35097b88e752; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominiums
    ADD CONSTRAINT "PK_bb7509828f6270f35097b88e752" PRIMARY KEY (id);


--
-- Name: enterprise_members PK_c1144a402891d4cd092913b6d51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enterprise_members
    ADD CONSTRAINT "PK_c1144a402891d4cd092913b6d51" PRIMARY KEY (id);


--
-- Name: community_infos PK_edcaa78a36b9f80c7265576503b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_infos
    ADD CONSTRAINT "PK_edcaa78a36b9f80c7265576503b" PRIMARY KEY (member_id);


--
-- Name: invites PK_f9ea8e222f455402376018d7637; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invites
    ADD CONSTRAINT "PK_f9ea8e222f455402376018d7637" PRIMARY KEY (member);


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
-- Name: enterprise_members REL_045ab85f2e1e678d08ad910f02; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enterprise_members
    ADD CONSTRAINT "REL_045ab85f2e1e678d08ad910f02" UNIQUE (user_id);


--
-- Name: condominiums REL_6b78fa2df803ad0355ebe9c476; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominiums
    ADD CONSTRAINT "REL_6b78fa2df803ad0355ebe9c476" UNIQUE (owner_id);


--
-- Name: invites REL_dce11b81d78d14cb6ce9f57370; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invites
    ADD CONSTRAINT "REL_dce11b81d78d14cb6ce9f57370" UNIQUE (member_id);


--
-- Name: enterprise_members UQ_5aded7c2cf19ef8d251ee987b0f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enterprise_members
    ADD CONSTRAINT "UQ_5aded7c2cf19ef8d251ee987b0f" UNIQUE (cpf, condominium_id);


--
-- Name: condominiums UQ_72b384c406b4575f20c517d20f5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominiums
    ADD CONSTRAINT "UQ_72b384c406b4575f20c517d20f5" UNIQUE (cnpj);


--
-- Name: enterprise_members UQ_87e0d48e0b88dd71fb048319df3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enterprise_members
    ADD CONSTRAINT "UQ_87e0d48e0b88dd71fb048319df3" UNIQUE (user_id, condominium_id);


--
-- Name: users UQ_9a2c510fa5c6e0069f4bd406a1f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_9a2c510fa5c6e0069f4bd406a1f" UNIQUE (unique_registry_id);


--
-- Name: condominiums UQ_9c660cb468b8f0d455724033e95; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominiums
    ADD CONSTRAINT "UQ_9c660cb468b8f0d455724033e95" UNIQUE (name);


--
-- Name: condominiums UQ_b99ec9dd3af9021583ac55b2311; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominiums
    ADD CONSTRAINT "UQ_b99ec9dd3af9021583ac55b2311" UNIQUE (cep);


--
-- Name: condominium_members UQ_condominium_members_user_id_condominium_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominium_members
    ADD CONSTRAINT "UQ_condominium_members_user_id_condominium_id" UNIQUE (user_id, condominium_id);


--
-- Name: invites UQ_invites_recipient_condominium_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invites
    ADD CONSTRAINT "UQ_invites_recipient_condominium_id" UNIQUE (recipient, condominium_id);


--
-- Name: unique_registries UQ_unique_registries_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unique_registries
    ADD CONSTRAINT "UQ_unique_registries_email" UNIQUE (email);


--
-- Name: enterprise_members FK_045ab85f2e1e678d08ad910f025; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enterprise_members
    ADD CONSTRAINT "FK_045ab85f2e1e678d08ad910f025" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: enterprise_members FK_9b881b02509468b500111bd8019; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enterprise_members
    ADD CONSTRAINT "FK_9b881b02509468b500111bd8019" FOREIGN KEY (condominium_id) REFERENCES public.condominiums(id) ON DELETE CASCADE;


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
-- Name: condominiums FK_condominiums_owner_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominiums
    ADD CONSTRAINT "FK_condominiums_owner_id" FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: invites FK_invites_condominium_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invites
    ADD CONSTRAINT "FK_invites_condominium_id" FOREIGN KEY (condominium_id) REFERENCES public.condominiums(id) ON DELETE CASCADE;


--
-- Name: invites FK_invites_member_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invites
    ADD CONSTRAINT "FK_invites_member_id" FOREIGN KEY (member_id) REFERENCES public.condominium_members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users FK_users_registry_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_users_registry_id" FOREIGN KEY (unique_registry_id) REFERENCES public.unique_registries(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

