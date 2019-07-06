import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import User from '../models/User';
import Appointment from '../models/Appointment';
import File from '../models/File';

class AppointmentController {
  async index(req, res) {
    /* Listagem de agendamentos encadeados por relacionamentos entre as tabelas
    Appointments, User e File */
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      // incluir tabela User na query
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          // incluir tabela File na query
          include: [
            { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
          ],
        },
      ],
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    // verifico se os dados foram validados
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos!' });
    }

    const { provider_id, date } = req.body;

    /* checar se o provider_id passado é realmente um provider_id válido */
    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true,
      },
    });

    /* checar se a data passada não está no passado, ou seja é inválida para agendar */
    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Você só pode criar agendamentos com provedores!' });
    }

    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      return res
        .status(400)
        .json({ error: 'Não é permitido selecionar hora no passado!' });
    }

    /* checar se já não existe um agendamento para a data passada */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Já existe um agendamento para esse horário!' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
