# 🚀 Projeto Social Network - Backend

Bem-vindo(a) ao backend da nossa Rede Social! [cite_start]Este projeto é desenvolvido em Node.js com o framework Express.js e se conecta a um banco de dados MySQL para persistir todas as informações da rede social. [cite_start]Ele serve como a API RESTful para o frontend (desenvolvido em React.js).

Este `README` é um guia para você começar a desenvolver, entender a estrutura do projeto e seguir as melhores práticas para contribuir.

## 1. Como Começar (Setup Inicial)

Para colocar o projeto no ar em sua máquina, siga os passos abaixo:

1.  **Pré-requisitos:**
    * Certifique-se de ter o [Node.js](https://nodejs.org/en/download/) (versão 18 ou superior é recomendada) e o `npm` (Node Package Manager) instalados. Você pode verificar as versões com:
        ```bash
        node -v
        npm -v
        ```
    * Tenha um servidor MySQL em execução. Você pode usar:
        * **MySQL Community Server** (instalação local).
        * **Docker:** Para uma solução rápida e isolada, você pode usar uma imagem MySQL. Ex: `docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:latest`.

2.  **Clone o Repositório:**
    Abra seu terminal ou prompt de comando, navegue até o diretório onde você quer salvar o projeto e clone o repositório principal:
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO_GITHUB>
    cd backend # Navegue para a pasta do backend se você clonou o repositório principal e o backend está dentro
    ```
    **Lembre-se de substituir `<URL_DO_SEU_REPOSITORIO_GITHUB>` pelo link real do repositório.**

3.  **Instale as Dependências:**
    Após navegar para o diretório `backend`, instale todas as dependências necessárias para o projeto:
    ```bash
    npm install
    ```
    Isso pode levar alguns minutos.

4.  **Crie o Banco de Dados e as Tabelas:**
    Nos entregáveis do projeto, há um requisito para scripts SQL de criação de tabelas e inserção de dados. Utilize esses scripts para configurar seu banco de dados MySQL.

    * **Crie o banco de dados:** No seu cliente MySQL (ex: MySQL Workbench, DBeaver, linha de comando), execute:
        ```sql
        CREATE DATABASE social_network_db;
        USE social_network_db;
        ```
        (ou o nome de banco de dados que você definir no `.env`)
    * **Execute o script de criação de tabelas:** Encontre o arquivo `create_tables.sql` (ou nome similar) e execute-o. 
        ```sql
        -- Exemplo de execução via linha de comando
        mysql -u seu_usuario -p social_network_db < path/para/seu/create_tables.sql
        ```
    * **Execute o script de inserção de dados:** Encontre o arquivo `insert_data.sql` (ou nome similar) e execute-o para popular as tabelas com dados de teste. 
        ```sql
        -- Exemplo de execução via linha de comando
        mysql -u seu_usuario -p social_network_db < path/para/seu/insert_data.sql
        ```

5.  **Crie o Arquivo de Variáveis de Ambiente:**
    Crie um arquivo chamado `.env` na raiz da pasta `backend`. Este arquivo conterá variáveis de ambiente que o projeto usará, como as credenciais do banco de dados e a porta do servidor.
    ```
    # Exemplo de .env
    PORT=3001
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=my-secret-pw # Sua senha do MySQL
    DB_NAME=social_network_db
    JWT_SECRET=sua_chave_secreta_jwt_aqui # Use uma chave segura e aleatória
    ```
    **Importante:** Nunca commite o arquivo `.env` para o Git, pois ele contém informações sensíveis. Ele já está no `.gitignore` para a sua segurança.

6.  **Inicie o Servidor de Desenvolvimento:**
    Com as dependências instaladas, o banco de dados configurado e o `.env` preenchido, você pode iniciar o aplicativo Node.js:
    ```bash
    npm start
    ```
    Este comando iniciará o servidor Express. Você deverá ver uma mensagem no console indicando que o servidor está rodando (geralmente em `http://localhost:3001`).

## 2. Estrutura de Pastas e Responsabilidades

Nosso backend segue uma estrutura organizada para promover a separação de responsabilidades e facilitar a manutenção e escalabilidade do código.

* **`node_modules/`**: Contém todos os pacotes e bibliotecas instalados pelo `npm`. Não modifique ou versiona esta pasta.
* **`.env`**: Armazena variáveis de ambiente sensíveis (ex: credenciais do BD, chaves secretas JWT) ou configurações específicas do ambiente.
* **`.gitignore`**: Define quais arquivos e pastas o Git deve ignorar (ex: `node_modules/`, `.env`).
* **`package.json`**: O manifesto do projeto, listando metadados, scripts e dependências.
* **`app.js`**: O ponto de entrada principal da aplicação. Inicializa o servidor Express, configura middlewares globais e monta as rotas da API.
* **`config/`**: Contém arquivos de configuração globais, como a configuração de conexão com o banco de dados.
    * **`database.js`**: Lógica para estabelecer e gerenciar a conexão com o banco de dados MySQL (utilizando `mysql2` ou um ORM como Sequelize).
* **`controllers/`**: Contém a lógica de negócio principal que responde às requisições HTTP. Recebe os dados da requisição, chama os serviços apropriados para processar a lógica, e envia a resposta ao cliente. Controllers **não acessam o banco de dados diretamente**.
* **`models/`**: Define a estrutura dos dados (esquemas) e a forma como você interage com o banco de dados.
    * Se usando um ORM (ex: Sequelize), aqui estarão as definições dos seus modelos que mapeiam para as tabelas do MySQL (e.g., `user.js`, `post.js`).
    * Se usando SQL puro com `mysql2`, estes arquivos podem conter funções que encapsulam as queries SQL para cada entidade, abstraindo a interação direta com o `pool` de conexões.
* **`routes/`**: Define os endpoints da sua API e os mapeia para as funções dos controllers correspondentes. Organiza as rotas por recurso (e.g., `userRoutes.js` para rotas de usuário).
* **`middleware/`**: Contém funções middleware personalizadas que podem ser executadas antes de um manipulador de rota. Exemplos incluem autenticação de usuário (`authMiddleware.js`), validação de dados, logging e tratamento de erros.
* **`services/`**: Contém a lógica de negócio mais complexa e orquestração de operações. Os serviços encapsulam a interação com a camada de `models` (ou com o driver `mysql2` para SQL puro), garantindo que as regras de negócio sejam aplicadas antes das operações no banco de dados. Os controllers chamam os serviços.
* **`utils/`**: Funções auxiliares gerais que podem ser úteis em qualquer parte do projeto (ex: funções de validação genéricas, helpers de formatação, utilitários de criptografia).

## 3. Como Subir Alterações para o GitHub (Commits Semânticos)

Contribuir para o projeto via Git/GitHub requer um fluxo de trabalho organizado para manter o histórico de mudanças limpo e fácil de entender.

### O que é um Commit Semântico?

Um commit semântico é uma convenção para formatar suas mensagens de commit, tornando o histórico do Git mais legível e permitindo a automação de algumas tarefas (como geração de changelogs).

**Estrutura Básica:**

**Tipos Comuns:**

* **`feat`**: Uma nova funcionalidade (feature).
* **`fix`**: Uma correção de bug.
* **`docs`**: Alterações na documentação.
* **`style`**: Alterações que não afetam o significado do código (espaços em branco, formatação, ponto e vírgula ausentes).
* **`refactor`**: Uma mudança de código que não corrige um bug nem adiciona uma funcionalidade.
* **`test`**: Adição ou correção de testes.
* **`build`**: Alterações que afetam o sistema de build ou dependências externas (npm, webpack).
* **`ci`**: Alterações nos arquivos e scripts de CI (Continuous Integration).
* **`perf`**: Uma mudança de código que melhora a performance.
* **`chore`**: Outras mudanças que não se enquadram nas categorias anteriores (ex: atualização de dependências menores).

**Exemplos de Commits Semânticos:**

* `feat(auth): Implementa rota de registro e login de usuário`
* `fix(posts): Corrige bug ao deletar postagem sem comentários`
* `docs(database): Adiciona diagrama do modelo de dados ao README`
* `style(lint): Configura ESLint e aplica correções de estilo`
* `refactor(messages): Otimiza busca de histórico de mensagens privadas`
* `chore(deps): Atualiza dependência 'express' para versão mais recente`

### Como Fazer um Commit:

1.  **Verifique o Status:**
    ```bash
    git status
    ```
    Veja quais arquivos foram modificados, adicionados ou excluídos.

2.  **Adicione os Arquivos para o Commit:**
    Adicione os arquivos que você deseja incluir no seu próximo commit.
    ```bash
    git add . # Adiciona todos os arquivos modificados/novos
    # OU
    git add src/controllers/userController.js src/services/userService.js # Adiciona arquivos específicos
    ```

3.  **Faça o Commit:**
    ```bash
    git commit -m "feat(posts): Implementa endpoints para criação e listagem de postagens"
    ```
    Substitua a mensagem pela sua mensagem de commit semântico.

4.  **Envie para o GitHub:**
    Após o commit local, envie suas alterações para o repositório remoto.
    ```bash
    git push origin <nome-da-sua-branch>
    ```
    **Lembre-se de substituir `<nome-da-sua-branch>` pelo nome da branch que você está trabalhando.**

## 4. Gerenciamento de Branches (Branches Semânticas)

Para manter o desenvolvimento organizado e permitir que várias pessoas trabalhem em paralelo, **nunca trabalhe diretamente na branch `main` (ou `master`)**. Crie sempre uma branch separada para cada nova funcionalidade, correção de bug, ou tarefa.

### Como Nomear uma Branch Semântica:

Siga uma convenção similar aos commits semânticos para os nomes das branches, usando um prefixo que indica o tipo de trabalho e um nome descritivo.

**Estrutura Básica:**

**Tipos Comuns de Branches:**

* **`feat/`**: Para novas funcionalidades.
    * Ex: `feat/user-auth`, `feat/group-management`
* **`fix/`**: Para correção de bugs.
    * Ex: `fix/db-connection-error`, `fix/message-status-update`
* **`docs/`**: Para alterações de documentação.
    * Ex: `docs/api-endpoints`
* **`refactor/`**: Para refatorações de código.
    * Ex: `refactor/error-handling`, `refactor/user-service`
* **`chore/`**: Para tarefas menores, não diretamente relacionadas a features ou bugs.
    * Ex: `chore/update-dependencies`

**Como Criar e Mudar para uma Nova Branch:**

1.  **Certifique-se de estar na branch `main` (ou `master`) e atualizada:**
    ```bash
    git checkout main
    git pull origin main
    ```
2.  **Crie sua nova branch e mude para ela:**
    ```bash
    git checkout -b feat/implement-private-messaging
    ```
    Isso cria a branch `feat/implement-private-messaging` e já te coloca nela.

3.  **Trabalhe na sua branch.**

4.  **Após terminar o trabalho, faça os commits e envie para o GitHub:**
    ```bash
    git push origin feat/implement-private-messaging
    ```

## 5. Mantendo Seu Projeto Atualizado (`git pull origin main`)

É crucial manter sua branch local atualizada com as últimas mudanças do repositório remoto, especialmente quando se trabalha em equipe. Isso evita conflitos e garante que você esteja sempre trabalhando com a versão mais recente do código.

### Como Atualizar Sua Branch:

1.  **Salve suas mudanças (se houver):**
    Antes de dar `git pull`, certifique-se de que não há mudanças não committadas em sua branch atual, ou faça um `git stash` para guardá-las temporariamente.

2.  **Vá para a branch `main` (ou `master`):**
    ```bash
    git checkout main
    ```

3.  **Puxe as últimas alterações da branch `main` remota:**
    ```bash
    git pull origin main
    ```
    Isso baixará e mesclará as últimas alterações da branch `main` do GitHub para sua branch `main` local.

4.  **Volte para sua branch de trabalho:**
    ```bash
    git checkout <nome-da-sua-branch>
    ```

5.  **Rebase sua branch com a `main` atualizada (recomendado):**
    ```bash
    git rebase main
    ```
    O `rebase` aplica seus commits *após* os commits mais recentes da `main`, criando um histórico de commits mais linear e limpo. Se houver conflitos, você precisará resolvê-los.

    *Alternativamente, você pode usar `git merge main` enquanto estiver na sua branch de trabalho, mas o `rebase` é geralmente preferido para manter o histórico limpo.*

## 6. Overview Básico de Node.js e Express.js

**Node.js:** É um ambiente de tempo de execução JavaScript de código aberto e multiplataforma que permite executar código JavaScript no lado do servidor. Ele é construído sobre o motor V8 do Chrome e é ideal para construir aplicações de rede escaláveis.

**Express.js:** É um framework web minimalista e flexível para Node.js que fornece um conjunto robusto de recursos para o desenvolvimento de aplicações web e APIs. Ele simplifica o processo de criação de rotas, manipulação de requisições e respostas, e integração com outros middlewares.

### Conceitos Chave:

* **Servidor HTTP:** O Express.js permite criar um servidor web que escuta requisições HTTP e envia respostas.
* **Rotas:** São os caminhos de URL que sua aplicação pode manipular (ex: `/api/users`, `/api/posts`). Você define qual função (controller) deve ser executada quando uma requisição chega em uma rota específica.
* **Requisição (`req`):** O objeto de requisição HTTP que contém informações sobre a requisição recebida (cabeçalhos, corpo da requisição, parâmetros da URL, query strings).
* **Resposta (`res`):** O objeto de resposta HTTP que você usa para enviar uma resposta de volta ao cliente (status code, corpo da resposta em JSON, HTML, etc.).
* **Middleware:** Funções que têm acesso aos objetos de requisição (`req`), resposta (`res`) e à próxima função middleware na pilha de requisição-resposta. Elas podem executar tarefas como:
    * Executar qualquer código.
    * Fazer modificações nos objetos de requisição e resposta.
    * Finalizar o ciclo de requisição-resposta.
    * Chamar a próxima middleware na pilha.
    * Exemplos: `express.json()`, `cors()`, middlewares de autenticação.
* **Banco de Dados MySQL:** O backend se conectará a um banco de dados MySQL para armazenar e recuperar dados da rede social. Isso é feito através de drivers (como `mysql2`) ou ORMs (como Sequelize), que permitem que o Node.js interaja com o banco de dados.

**Recursos de Aprendizagem:**

* **Documentação Oficial do Node.js:** [https://nodejs.org/en/docs/](https://nodejs.org/en/docs/)
* **Documentação Oficial do Express.js:** [https://expressjs.com/](https://expressjs.com/)
* **Tutoriais sobre Node.js e Express.js:** FreeCodeCamp, DigitalOcean, MDN Web Docs.