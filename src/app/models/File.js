import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      // primeiro parametro é um objeto com os dados que serão inseridos no banco
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.path}`;
          },
        },
      },
      // segundo parametro é o objeto sequelize e outras configurações que eu desejar
      {
        sequelize,
      }
    );
    return this;
  }
}

export default File;
