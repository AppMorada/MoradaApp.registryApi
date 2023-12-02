# Documento de Justificativa - SPRINT 2

## 1. Introdução
### 1.1 Objetivo do Documento
O objetivo dos documentos de justificativa são voltados no foco em esclarecer e elucidar as ações tomadas pela equipe de desenvolvedores envolvida, aprimorando a nossa política de transparência com os demais membros da equipe.

### 1.2 Contexto
Atualmente, o produto criado pela equipe de back-end se encontra com os seguintes fluxos criados:

- Fluxo de autenticação;
- Fluxo de autorização de ações com base em cargos;
- Fluxo de cadastramento de usuários, administradores e super admin;
- Fluxo de geração de OTPs (senhas/códigos de uso único).

Podendo ser acompanhados de maneira mais precisa no [fluxograma do projeto](https://lucid.app/lucidchart/d56c30bf-b5a9-453d-8bb8-571033c28d70/edit?invitationId=inv_2dbf5237-f691-4d48-9a33-8fb1763acc80&page=0_0#). Além disso, é válido destacar que todos os materiais criados e implantados em nuvem se encontram no aguardo para a aplicação de testes com o suporte da equipe de Quality Assurance.

## 2. Objetivos e alterações

### 2.1 Objetivo Principal
Realizar a transferência dos sistemas vigentes do MoradaApp para a provedora de SaaS Firebase - na qual se encontra altamente integrada com o Google Cloud Provider (GCP) - para, assim, assegurar maior performance, segurança, testabilidade e manutenibilidade. Cabe destacar que as migrações neste sprint ocorrerão de maneira parcial, deixando assim, as instâncias de banco de dados fora do escopo de alterações, por hora.

### 2.2 Escopo de Alterações/adições

- Ambiente de hospedagem da API;
- Aprimoramento no ambiente de análise do código;
- Definição de CI/CD remoto.

## 3. Justificando
### 3.1 Razões
As alterações e mudanças a serem realizadas neste sprint são justificadas com base nas limitações impostas pela provedora atual, onde por mais que os serviços utilizados estejam em um nível gratuito, percebe-se uma notável limitação computacional, observe as tabelas de comparação logo abaixo:

|       | Cyclic (atual) | Firebase (plano gratuito) |
|-------|--------------------------|----------|
| Espaço por servidor    | 260MB em nível gratuito | 500MB em nível gratuito |
| Chamadas ao servidor | 1000/mês | 2 milhões por mês em nível gratuito |
| Limite de repositórios | 1 repositório por plano | Indefinido, contanto que não ultrapasse os limites computacionais estabelecidos |
| Inserção de novos membros | Não | Sim |
| Acesso aos logs | Não compartilhável | Todos os usuários que possuem o cargo necessário para tal pode visualizar |
| Possibilidade de automações customizadas | Não | Sim |
| Tempo máximo aceito de duração por chamada ao servidor | 10 segundos | 9 minutos |

Adiante, o Firebase (provedor a ser usado) tem mais algumas limitações a serem observadas, na qual se encontram abaixo:

|    | Plano gratuito | Plano pago |
|----|-------------- | ----|
| Chamadas ao serviço | 2 milhões/mês | US$0,40/milhão |
| GB/segundo | 400 mil por mês | Depois será cobrado com base na tabela de preços do [GCP](https://cloud.google.com/functions/pricing?hl=pt-br) |
| Segundos de uso de CPU | 200 mil/mês | Depois será cobrado com base na tabela de preços do [GCP](https://cloud.google.com/functions/pricing?hl=pt-br) |
| Rede de saída | 5 GB/mês | US$0,12/GB |
| Minutos do Cloud Build | 120 minuto/dia | US$0,003/minuto |
| Espaço por servidor | 500 MB | US$0,10 por GB ao mês |

### 3.2 Impactos Atuais e Futuros
Com base no que foi fornecido, chega-se a conclusão de que a migração, mesmo que parcial dos servidores existentes do MoradaApp da Cyclic para o Firebase, pode gerar um aumento significativo nos recursos computacionais disponíveis para os serviços em questão. Adiante, é possível estabelecer e aprimorar critérios já existentes, como a segurança, performance e facilidade de realizar testes na aplicação.

## 4. Riscos e Mitigações

### 4.1 Possíveis custos
- **Avaliação de impacto**: apesar do Firebase e GCP possuírem um plano gratuito, caso os testes e a utilização da aplicação não seja planejada de maneira inteligente, pode-se resultar em pequena faturas ao final do mês;
- **Probabilidade de insurgência**: baixa.
- **Mitigação**: para reduzir a probabilidade de uma eventual cobrança inesperada por parte do GCP/Firebase, recomenda-se ativar alerta dedicado para isso e avisar os usuários da nossa API sobre as tabelas de preços estabelecidas. Além disso, cabe aos devs de back-end, estabelecer uma política de uso regulatório dos serviços envolvidos

### 4.2 Dificuldade em estabelecer um ambiente estável para os QAs
- **Avaliação do impacto**: ao propor que neste mesmo sprint iremos criar um ambiente adequado para os QAs, onde os mesmos possam realizar testes, visualizar logs e ter acesso a code analysis, automaticamente a equipe de back-end assume a responsabilidade de estabelecer relações com serviços de baixo orçamento, tendo em vista a proposta do projeto. Como consequência, a pesquisa destas ferramentas pode se mostrar desafiadora;
- **Probabilidade de insurgência**: média.
- **Mitigação**: cabe aos responsáveis pelo estabelecimento destas ferramentas, dialogar com a equipe de QAs e Stakeholders e fazer pesquisas sobre possíveis sistemas de baixo custo e com uma curva de aprendizado adequada para o time de testes.

### 4.3 Incompatibilidade de Serviços
- **Avaliação de impacto**: Apesar da migração entre provedores ser totalmente possível quando se trata das Serverless Functions (Nosso servidor em questão), a migração integral e granular de todos os serviços pode se mostrar desafiadora, tendo em vista que realizar o deslocamento de um banco de dados para o outro pode não ser totalmente possível haja visto que os mesmos não possuem o mesmo paradigma;
- **Probabilidade de insurgência**: alta.
- **Mitigação**: como já citado, realizar a transição gradual dos serviços já presentes no sistema, começando pelos servidores de back-end - no caso a API em questão - criados utilizando o NestJs. Enquanto isso, deixar certos membros encarregados de estudar a viabilidade das migrações dos bancos de dados para o Firebase, caso isto seja inviável, cabe os desenvolvedores planejarem uma possível utilização destas instâncias dentro do próprio GCP, plataforma essa similar a AWS e Azure e que se encontra altamente integrada ao Firebase, facilitando assim, a comunicação entre os serviços.

