const bcrypt = require('bcryptjs');

// --- DADOS DE USUÁRIOS E AUTENTICAÇÃO ---
// As senhas são hasheadas na inicialização para simular um banco de dados real.
let usuarios = [
    { id: 1, nome_de_usuario: 'ana_dev', email: 'ana.dev@email.com', senha_hash: bcrypt.hashSync('senha123', 8), foto_de_perfil: 'https://placehold.co/100x100/EEDD82/000000?text=AD', data_nascimento: '1995-03-15' },
    { id: 2, nome_de_usuario: 'bruno_gamer', email: 'bruno.g@email.com', senha_hash: bcrypt.hashSync('senha123', 8), foto_de_perfil: 'https://placehold.co/100x100/82B3EE/FFFFFF?text=BG', data_nascimento: '1998-07-22' },
    { id: 3, nome_de_usuario: 'carla_viajante', email: 'carla.v@email.com', senha_hash: bcrypt.hashSync('senha123', 8), foto_de_perfil: 'https://placehold.co/100x100/98FB98/000000?text=CV', data_nascimento: '1992-11-30' },
    { id: 4, nome_de_usuario: 'diego_chef', email: 'diego.chef@email.com', senha_hash: bcrypt.hashSync('senha123', 8), foto_de_perfil: 'https://placehold.co/100x100/F08080/FFFFFF?text=DC', data_nascimento: '2000-01-05' }
];
let nextUserId = usuarios.length + 1;

let conexoes = [
    // ana_dev (1) e bruno_gamer (2) já são amigos.
    { solicitante_id: 1, receptor_id: 2, status: 'aceito' },
    // carla_viajante (3) enviou uma solicitação para ana_dev (1)
    { solicitante_id: 3, receptor_id: 1, status: 'pendente' }
];
// --- DADOS DE POSTS ---
let posts = [
    { id: 1, usuario_id: 1, tipo_conteudo: 'texto', conteudo: 'Acabei de terminar um projeto em Node.js. Que sensação incrível de dever cumprido! #devlife', data_criacao: new Date('2025-06-07T13:00:00Z') },
    { id: 2, usuario_id: 2, tipo_conteudo: 'imagem', conteudo: 'https://placehold.co/600x400/222222/FFFFFF?text=Novo+Setup+Gamer!', data_criacao: new Date('2025-06-07T14:30:00Z') },
    { id: 3, usuario_id: 3, tipo_conteudo: 'texto', conteudo: 'Planejando a próxima viagem! Qual o destino dos sonhos de vocês? Deixem dicas!', data_criacao: new Date('2025-06-07T15:15:00Z') },
];
let comentarios = [
    { id: 1, conteudo: 'Parabéns, Ana! Qual foi o maior desafio?', post_id: 1, usuario_id: 2, comentario_pai_id: null, data_criacao: new Date('2025-06-07T13:05:00Z') },
    { id: 2, conteudo: 'Obrigado, Bruno! A parte de promises e async/await foi um pouco complicada no início.', post_id: 1, usuario_id: 1, comentario_pai_id: 1, data_criacao: new Date('2025-06-07T13:08:00Z') },
];
let avaliacoes = [
    { id: 1, usuario_id: 2, post_id: 1, comentario_id: null, tipo_avaliacao: 'positiva' },
    { id: 2, usuario_id: 3, post_id: 1, comentario_id: null, tipo_avaliacao: 'positiva' },
    { id: 3, usuario_id: 1, post_id: null, comentario_id: 1, tipo_avaliacao: 'positiva' },
];
let nextPostId = posts.length + 1;
let nextCommentId = comentarios.length + 1;
let nextAvaliacaoId = avaliacoes.length + 1;

// --- DADOS DE GRUPOS ---
let grupos = [
    { id: 1, nome: 'Amantes de Node.js', descricao: 'Um grupo para discutir as maravilhas e desafios do Node.js.', data_criacao: new Date('2025-05-10T10:00:00Z'), criador_id: 1 },
    { id: 2, nome: 'Gamers de Plantão', descricao: 'Compartilhe suas conquistas, setups e os melhores jogos do momento.', data_criacao: new Date('2025-05-12T15:30:00Z'), criador_id: 2 },
    { id: 3, nome: 'Mochileiros do Brasil', descricao: 'Dicas de viagens, rotas e lugares incríveis para conhecer no nosso país.', data_criacao: new Date('2025-05-15T20:00:00Z'), criador_id: 3 },
    { id: 4, nome: 'Fãs de Culinária', descricao: 'Compartilhando receitas e dicas de cozinha.', data_criacao: new Date('2025-06-08T12:00:00Z'), criador_id: 4 }
];
let membros_grupos = [
    { grupo_id: 1, usuario_id: 1, funcao: 'admin' }, { grupo_id: 1, usuario_id: 2, funcao: 'membro' }, { grupo_id: 1, usuario_id: 4, funcao: 'membro' },
    { grupo_id: 2, usuario_id: 2, funcao: 'admin' }, { grupo_id: 2, usuario_id: 1, funcao: 'admin' },
    { grupo_id: 3, usuario_id: 3, funcao: 'admin' }, { grupo_id: 3, usuario_id: 1, funcao: 'admin' },
    { grupo_id: 4, usuario_id: 4, funcao: 'admin' }, { grupo_id: 4, usuario_id: 1, funcao: 'membro' }, { grupo_id: 4, usuario_id: 3, funcao: 'membro' }
];
let mensagens_grupos = [
    { id: 1, grupo_id: 1, usuario_id: 1, conteudo: 'Pessoal, alguém já usou a nova versão do Express?', data_criacao: new Date('2025-06-07T14:00:00Z') },
    { id: 2, grupo_id: 1, usuario_id: 2, conteudo: 'Ainda não, mas estou ansioso para testar o suporte a Promises nativas!', data_criacao: new Date('2025-06-07T14:05:00Z') },
    { id: 3, grupo_id: 2, usuario_id: 2, conteudo: 'Alguém jogando o novo RPG que lançou essa semana?', data_criacao: new Date('2025-06-07T11:00:00Z') },
    { id: 4, grupo_id: 4, usuario_id: 4, conteudo: 'Olá pessoal! Qual a receita para o almoço de hoje?', data_criacao: new Date('2025-06-08T12:01:00Z') }
];
let nextGroupId = grupos.length + 1;
let nextGroupMessageId = mensagens_grupos.length + 1;

module.exports = {
    usuarios, posts, comentarios, avaliacoes,
    grupos, membros_grupos, mensagens_grupos, conexoes,
    nextUserId, nextPostId, nextCommentId, nextAvaliacaoId,
    nextGroupId, nextGroupMessageId,
};
