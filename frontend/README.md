# 🚀 Projeto Social Network - Frontend

Bem-vindo(a) ao frontend da nossa Rede Social! Este projeto é desenvolvido em React.js e serve como a interface do usuário para interagir com o nosso backend (Node.js + MySQL).

Este `README` é um guia para você começar a desenvolver, entender a estrutura do projeto e seguir as melhores práticas para contribuir.

## 1. Como Começar (Setup Inicial)

Para colocar o projeto no ar em sua máquina, siga os passos abaixo:

1.  **Pré-requisitos:**
    * Certifique-se de ter o [Node.js](https://nodejs.org/en/download/) (versão 18 ou superior é recomendada) e o `npm` (Node Package Manager) instalados. Você pode verificar as versões com:
        ```bash
        node -v
        npm -v
        ```

2.  **Clone o Repositório:**
    Abra seu terminal ou prompt de comando, navegue até o diretório onde você quer salvar o projeto e clone o repositório principal:
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO_GITHUB>
    cd frontend # Navegue para a pasta do frontend se você clonou o repositório principal e o frontend está dentro
    ```
    **Lembre-se de substituir `<URL_DO_SEU_REPOSITORIO_GITHUB>` pelo link real do repositório.**

3.  **Instale as Dependências:**
    Após navegar para o diretório `frontend`, instale todas as dependências necessárias para o projeto:
    ```bash
    npm install
    ```
    Isso pode levar alguns minutos.

4.  **Crie o Arquivo de Variáveis de Ambiente:**
    Crie um arquivo chamado `.env` na raiz da pasta `frontend`. Este arquivo conterá variáveis de ambiente que o projeto usará, como a URL do seu backend.
    ```
    # Exemplo de .env
    REACT_APP_API_BASE_URL=http://localhost:3001/api # Ajuste a porta se seu backend estiver em outra
    ```
    **Importante:** Nunca commite o arquivo `.env` para o Git, pois ele pode conter informações sensíveis. Ele já está no `.gitignore` para a sua segurança.

5.  **Inicie o Servidor de Desenvolvimento:**
    Com as dependências instaladas e o `.env` configurado, você pode iniciar o aplicativo React:
    ```bash
    npm start
    ```
    Este comando irá abrir o aplicativo no seu navegador padrão (geralmente em `http://localhost:3000`). O servidor de desenvolvimento detecta automaticamente as mudanças no código e recarrega a página.

## 2. Estrutura de Pastas e Componentes
**Funções Principais das Pastas:**

* **`public/`**: Contém o `index.html`, o único arquivo HTML da sua aplicação React. Ele é o ponto de montagem do React.
* **`src/`**: O coração do seu projeto.
    * **`components/`**: Pense em "átomos" ou "moléculas" da sua UI. Pequenos blocos de construção, como um `<Button>`, `<Card>`, ou `<Input>`. Eles devem ser o mais genéricos possível e não devem ter lógica de negócio específica.
    * **`pages/`**: Pense em "organismos" ou "templates". São as telas completas que o usuário verá, como a página de login, o feed principal, o perfil de um usuário. Elas orquestram e utilizam vários componentes.
    * **`layouts/`**: Estruturas que se repetem em múltiplas páginas, como um cabeçalho, um rodapé ou uma barra lateral de navegação.
    * **`contexts/`**: Quando você precisa que dados ou funções estejam disponíveis para muitos componentes em diferentes partes da sua árvore sem passar props manualmente de nível em nível (evitar "prop drilling").  Exemplos: informações do usuário logado (`AuthContext`), preferências de tema. 
    * **`hooks/`**: Para encapsular e reutilizar lógica com estado entre diferentes componentes.  Se você tem uma lógica de carregamento de dados, validação de formulário ou qualquer comportamento interativo que se repete, crie um custom hook aqui. 
    * **`api/`**: Centraliza toda a comunicação com o backend.  Aqui você terá funções que chamam suas APIs REST (ex: `loginUser`, `fetchPosts`, `createGroup`). Isso mantém sua lógica de UI separada da lógica de dados. 
    * **`utils/`**: Funções auxiliares gerais que podem ser úteis em qualquer parte do projeto (ex: formatadores de data, funções de validação genéricas).
    * **`assets/`**: Onde você guarda imagens, ícones e fontes que são importados e usados diretamente nos seus componentes React.
    * **`styles/`**: Estilos globais, variáveis CSS, ou configurações para bibliotecas de UI/CSS-in-JS.
    * **`routes/`**: Define as rotas da sua aplicação e quais componentes (`pages`) serão renderizados para cada URL.

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

* `feat(auth): Adiciona tela de login com validação de email e senha`
* `fix(posts): Corrige erro de carregamento ao exibir postagens sem imagem`
* `docs(README): Atualiza seção de setup inicial`
* `style(buttons): Ajusta padding e border-radius dos botões principais`
* `refactor(user-profile): Otimiza a renderização do componente de perfil do usuário`
* `chore(deps): Atualiza react-router-dom para a versão 6.0`

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
    git add src/pages/Auth/LoginPage.js src/api/authApi.js # Adiciona arquivos específicos
    ```

3.  **Faça o Commit:**
    ```bash
    git commit -m "feat(posts): Implementa funcionalidade de criação de nova postagem"
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
    * Ex: `feat/user-registration`, `feat/post-comments`
* **`fix/`**: Para correção de bugs.
    * Ex: `fix/login-bug`, `fix/profile-image-upload`
* **`docs/`**: Para alterações de documentação.
    * Ex: `docs/update-readme`
* **`refactor/`**: Para refatorações de código.
    * Ex: `refactor/api-calls`, `refactor/button-component`
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
    git checkout -b feat/implement-groups-page
    ```
    Isso cria a branch `feat/implement-groups-page` e já te coloca nela.

3.  **Trabalhe na sua branch.**

4.  **Após terminar o trabalho, faça os commits e envie para o GitHub:**
    ```bash
    git push origin feat/implement-groups-page
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

## 6. Overview Básico de React

React é uma biblioteca JavaScript para construir interfaces de usuário. Ele permite que você crie componentes de UI reutilizáveis e gerencie o estado da sua aplicação de forma eficiente.

### Conceitos Chave:

* **Componentes:** São os blocos de construção do React. Podem ser funções ou classes que retornam elementos React que descrevem o que deve aparecer na tela. Ex: `Button`, `PostCard`, `Header`.
* **JSX:** É uma extensão de sintaxe para JavaScript que se parece muito com HTML. É usado para descrever a estrutura da UI dentro do seu código JavaScript.
    ```jsx
    // Exemplo de JSX em um componente funcional
    function WelcomeMessage(props) {
      return <h1>Olá, {props.name}!</h1>;
    }
    ```
* **Props (Properties):** São argumentos que você passa para os componentes. Eles permitem que os componentes sejam dinâmicos e reutilizáveis, pois recebem dados externos. Props são somente leitura.
* **State (Estado):** É um objeto JavaScript que armazena dados que podem mudar ao longo do tempo e afetar a renderização do componente. Quando o estado de um componente muda, o React o renderiza novamente. No React moderno, usamos o Hook `useState` para gerenciar o estado em componentes funcionais.
    ```jsx
    import React, { useState } from 'react';

    function Counter() {
      const [count, setCount] = useState(0); // count é o estado, setCount é a função para atualizá-lo

      return (
        <div>
          <p>Você clicou {count} vezes</p>
          <button onClick={() => setCount(count + 1)}>
            Clique aqui
          </button>
        </div>
      );
    }
    ```
* **Hooks:** São funções especiais (como `useState`, `useEffect`, `useContext`) que permitem que você "engate" nos recursos do React (como estado e ciclo de vida) em componentes funcionais. 
    * `useState`: Para adicionar estado a componentes funcionais.
    * `useEffect`: Para lidar com efeitos colaterais (chamadas de API, manipulação do DOM, timers) em componentes funcionais.
    * `useContext`: Para acessar o valor de um Contexto.
* **Ciclo de Vida do Componente:** Componentes React passam por diferentes fases (montagem, atualização, desmontagem). O `useEffect` é a forma de lidar com esses momentos em componentes funcionais.
* **Roteamento (React Router DOM):** Usado para criar navegação entre as diferentes "páginas" (componentes) da sua aplicação sem que a página inteira seja recarregada.

**Recursos de Aprendizagem:**

* **Documentação Oficial do React:** [https://react.dev/](https://react.dev/) (altamente recomendado!)
* **FreeCodeCamp:** Tutoriais interativos de React.

---