import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      // primeiro parametro é um objeto com os dados que serão inseridos no banco
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      // segundo parametro é o objeto sequelize e outras configurações que eu desejar
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    // salvar a referencia de um id de usuario para gerar relacionamento
    // de appointment e user
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
