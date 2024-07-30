# Diagrama de infraestrutura

## Sobre

O diagrama de infraestrutura é um documento elaborado em notação C4 dedicado a indicar como os componentes deste módulo estão organizados dentro do GCP e localmente

## Em nuvem

O diagrama a seguir se refere a maneira como os componentes estão organizados em nuvem dentro do GCP:

![Diagrama de infra em nuvem](docs/infra/prod.svg)

## Local

O diagrama a seguir representa a maneira como os componentes estão organizados localmente pelo docker compose:

![Diagram de infra local](docs/infra/dev.svg)

## Diferenças

As principais diferenças entre os dois diagrama é a maneira como os recursos de monitoramento está sendo utilizado, em produção, o GCP se responsabiliza por monitorar todos os erros e notificar os envolvidos, além de coletar os traces gerados pelo módulo. No entanto, no ambiente de execução local, os recursos de monitoramento são mais simples, contendo somente o Zipkin para coletar os traces e expor nas rotas indicadas pelo docker compose. 
