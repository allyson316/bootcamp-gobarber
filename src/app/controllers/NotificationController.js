import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    /* checar se o usuario logado é um provedor válido */
    const checkIsProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Somente provedores podem carregar notificações!' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    return res.json(notifications);
  }
}

export default new NotificationController();
