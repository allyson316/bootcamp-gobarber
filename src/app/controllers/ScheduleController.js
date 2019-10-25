import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize'; // operador do sequelize
import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'Usuário não é um prestador!' });
    }

    const { date } = req.query;
    const parseDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        // listar agendamentos que estão entre o começo e o fim do date passado
        date: { [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)] },
      },
      include: [{ model: User, as: 'user', attributes: ['name'] }],
      order: ['date'],
    });

    return res.json({ appointments });
  }
}

export default new ScheduleController();
