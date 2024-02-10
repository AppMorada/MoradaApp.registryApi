# Morada App - API

## Sobre
Esta é uma API feita em NestJS e projetada para atender os serviços do projeto Morada APP. Sendo assim, buscamos facilitar a vida dos moradores de condomínio e dos desenvolvedores responsáveis por integrar nosso código em seus sistemas.

Adiante, nossos servidores back-end devem contar com as seguintes dependências e ferramentas para que esteja em perfeito funcionamento:

1. **Mailtrap**: em ambiente de desenvolvimento, usamos o Mailtrap para realizar o envio de emails dentro da plataforma;
2. **Postgres**: banco de dados SQL do projeto; 
3. **Redis**: para gerar dados que possuem prazo de expiração ou realizar o cache das entidades do sistema, usamos o banco de dados de cache 'Redis';
4. **PNPM**: para gerenciar nossas dependências estamos usando o Performant Node Package Manager ([PNPM](https://pnpm.io/pt/)). Por quê? A resposta é simples, o pnpm é capaz de gerar links simbólicos de cada dependência utilizada no projeto, como consequência, o mesmo é capaz de reutilizar as bibliotecas que já existem em uma máquina, reduzindo de maneira significativa o espaço consumido pelo nosso sistema;
5. **Docker**: o Docker é uma plataforma de virtualização de contêineres que permite isolar e empacotar aplicativos e seus ambientes de execução em contêineres, facilitando a preparação do ambiente do sistema e viabilizando o deploy da aplicação em inúmeras provedoras de nuvem. Sendo assim, basta executar os comandos que serão passados logo mais, e você já será capaz de possuir todos os servidores prontos para execução rapidamente. Matando assim, a necessidade de se passar horas na frente do computador configurando serviço a serviço para rodar na sua máquina;
6. **Docker Compose**: é um orquestrador de contêineres do Docker, responsável por manter o sistema funcionando em conjunto, podendo configurar redes internas, mapear as portas de cada serviço e entre outras inúmeras funcionalidades essenciais;

### Preparação
Primeiramente, antes de começar a "levantar" o sistema, você deve ter instalado em sua máquina todas as dependências citadas acima, segue abaixo as instruções de instalação para cada sistema operacional:

- **Docker**
    1. [Linux](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)
    2. [Windows]()

- **Docker Compose**
    1. [Linux](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04)
    2. [Windows]()

- **PNPM**: execute ```npm i pnpm -g```

- **Mailtrap**:
    1. Crie uma conta na plataforma por [aqui](https://mailtrap.io/).
    2. Acesse o menu da lateral a esquerda
    3. Entre em **Email Testing** > **Inboxes** > **[Seu usuário]**
    4. Copie e cole o arquivo .env.example em .env
    5. Ao lado direito, na opção 'Integrations', troque para o nodemailer
    7. Copie e cole as credenciais no .env para visualizar os dados
    8. Insira em HOST_SENDER o valor 'sandbox.smtp.mailtrap.io'
    9. Insira em HOST_PORT_SENDER o valor 2525
    10. Coloque qualquer nome em NAME_SENDER
    11. Insira auth.user em EMAIL_SENDER
    12. Insira auth.pass em PASS_SENDER

## Como usar

Feito isso, você pode optar por utilizar o sistema otimizado para a execução local usando o docker-compose.local.yml ou então usar o docker-compose.yml para usar o back-end em ambiente dedicado ao desenvolvimento do ponto de vista de um desenvolvedor back-end:

```
docker compose -f <docker compose de sua preferência> up
```

Feito isso, se você tiver optado por utilizar o docker-compose.local.yml, o tutorial acaba aqui. No entanto, se estiver usando o outro arquivo, adentre na aplicação usando o bash para entrar na instância app (o contêiner em NodeJS + NestJS):
```
docker compose exec app bash
```

Dentro do contêiner, execute as migrations do prisma:
```
pnpm prisma migrate dev
```

Por padrão, o nosso contêiner já tem o pnpm instalado, então você não precisa instalá-lo no contexto do mesmo, sendo assim, basta você realizar o login na sua conta do firebase **DENTRO DO CONTÊINER**:
```
firebase login --no-localhost
```

Logo em seguida, instale os emuladores requisitados para um bom funcionamento da aplicação:
```
firebase init emulators
```

Se a instalação ocorreu com êxito, abra outro terminal e **FORA DO CONTÊINER** execute o comando abaixo. Por quê? Ele vai definir os hooks do git necessários para que você consiga automatizar processos de lint, formatação e testes locais toda vez que fazer commit:
```
pnpm set-hooks
```

Pronto, agora execute somente ```git commit``` sempre que quiser salvar suas alterações inseridas pelo ```git add```.

## Comandos
Agora você esta apto a executar a aplicação dentro do contêiner.
<br>
Para executar a aplicação em ambiente de desenvolvimento:
```
pnpm dev 
```

Para escutar as modificações que você fez dentro das functions:
```
pnpm build:watch:custom
```

Para executar testes unitários na aplicação:
```
pnpm test
```

Para fazer o build da aplicação:
```
pnpm build
```

## Bônus

Já temos as instâncias ativas, para você consultar os serviços de armazenamento basta executar os seguintes comandos:

### Postgres
```
docker compose exec db psql -U default -d mydb
```
Documentação do Postgres [aqui](https://www.postgresql.org/docs/current/).

## Coleções de requisições
Sinta-se a vontade consultando a nossa api tanto pelo [Swagger](https://wild-leather-jacket-cow.cyclic.cloud/api) quanto pelo [Postman](https://documenter.getpostman.com/view/25622444/2s9YR85Z9K).

