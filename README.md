# RealEconomy Frontend

Frontend da plataforma RealEconomy, desenvolvido com React e Vite para navegação pública de imóveis, autenticação de usuários e gerenciamento de anúncios. A aplicação oferece busca com filtros, visualização de detalhes, área do usuário autenticado e painel administrativo para manutenção de cidades permitidas.

## Visão geral

O projeto foi pensado como uma interface para um marketplace imobiliário. A experiência principal inclui:

- listagem pública de imóveis disponíveis
- filtros por cidade, tipo de negócio, tipo de imóvel e faixa de preço
- página de detalhes do imóvel
- cadastro e login com CPF e senha
- rotas privadas para áreas autenticadas
- criação, edição e exclusão de anúncios do usuário
- painel admin para cadastrar e remover cidades

## Funcionalidades

- navegação entre páginas com React Router
- autenticação baseada em access token e refresh token
- renovação automática de sessão quando a API responde com 401
- persistência de dados do usuário no localStorage
- busca automática de endereço via CEP usando a API do ViaCEP
- validação de cidade disponível para anúncios
- gestão de cidades com dados consumidos do IBGE no painel admin
- suporte a imóveis para venda, aluguel ou ambos

## Tecnologias utilizadas

- React 19
- Vite
- React Router DOM
- Axios
- rc-slider
- CSS puro

## Requisitos

Antes de executar o projeto, é necessário ter:

- Node.js instalado
- npm ou outro gerenciador de pacotes compatível
- backend da aplicação em execução

## Configuração do ambiente

O frontend consome a API definida em uma variável de ambiente na raiz do projeto.

Exemplo de configuração:

REACT_APP_API_URL=http://localhost:5000

Se o backend estiver em outro endereço, basta alterar esse valor.

## Instalação e execução

1. Instale as dependências:

npm install

2. Inicie o ambiente de desenvolvimento:

npm run dev

3. Acesse a aplicação no endereço exibido pelo Vite, geralmente:

http://localhost:5173

## Scripts disponíveis

- npm run dev: inicia o servidor de desenvolvimento
- npm run build: gera a build de produção
- npm run preview: executa a build localmente para conferência
- npm run lint: executa as validações do ESLint

## Estrutura do projeto

src/
- main.jsx: ponto de entrada da aplicação
- App.jsx: definição das rotas
- index.css: estilos globais
- services/api.js: configuração do cliente HTTP e interceptação de tokens
- contexts/AuthContext.jsx: contexto de autenticação
- components/: componentes reutilizáveis como navbar e rota privada
- pages/: páginas da aplicação

## Rotas da aplicação

- /: página inicial com a listagem de imóveis
- /imoveis/:id: detalhes de um imóvel
- /login: autenticação do usuário
- /register: cadastro de novo usuário
- /meus-imoveis: lista de imóveis do usuário logado
- /imoveis/novo: formulário de anúncio
- /imoveis/:id/editar: edição de anúncio
- /admin: painel administrativo

## Fluxo principal

O visitante pode navegar pela listagem pública e abrir os detalhes de um imóvel. Após o login, o sistema armazena os tokens e os dados básicos do usuário, liberando as rotas privadas. Usuários autenticados podem anunciar, editar e excluir seus próprios imóveis. Usuários com perfil admin também podem acessar o painel administrativo para cadastrar ou remover cidades.

## Regras de negócio

- anúncios só podem ser criados se a cidade do CEP estiver cadastrada como permitida
- o formulário de imóvel preenche endereço automaticamente com base no CEP
- imóveis podem ser anunciados para venda, aluguel ou ambos
- o acesso às áreas privadas exige usuário autenticado
- em caso de expiração do access token, o frontend tenta renovar a sessão automaticamente

## Observações

- o projeto depende de uma API backend para funcionar corretamente
- a gestão de cidades depende do perfil admin
- a variável de ambiente atual segue o padrão já usado no código do projeto