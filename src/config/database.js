require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true, // criação de dois campos de data de criação e atualização
    underscored: true, // tabela padrão: userGroup = user_group
    underscoredAll: true, // campo padrão: userGroup = user_group
  },
};
