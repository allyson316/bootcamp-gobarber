module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'root',
  password: 'root',
  database: 'gobarber',
  define: {
    timestamps: true, // criação de dois campos de data de criação e atualização
    underscored: true, // tabela padrão: userGroup = user_group
    underscoredAll: true, // campo padrão: userGroup = user_group
  },
};
