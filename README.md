# Morada App - API

## Instruções
Esta é uma API, feita em NestJS, dedicada aos serviços da Morada App. Segue abaixo as depedências externas do serviço na qual o usuário deve se atentar para porta-las em sua maquina e as devidas instruções de como a utilizar em sua maquina:

### Depedências externas
1. Postgres
2. PNPM
3. Docker
4. Docker Compose

### Como usar
Primeiramente, ative os containers necessários para o projeto com:
```
docker compose up
```

Agora, entre no container da aplicação e logo em seguida instale as dependências:
```
docker compose exec app bash
```
```
pnpm install
```

E por fim, FORA DO CONTAINER habilite os hooks necessários para automatizar algumas tarefas importantes, como o processo de lint:
```
pnpm set-hooks
```

Se achar necessário, você também pode se conectar com o Postgres da aplicação usando o seguinte comando:
```
docker compose exec db psql -U default -d mydb
```

## Coleção de requisição rápida
Caso queira ter acesso a documentação de cada requisição da nossa aplicação, você pode acessar este [link](https://weary-boa-earmuffs.cyclic.app/api).
