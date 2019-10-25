import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class UserController {
  async store(req, res) {
    // validação dos dados com yup
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    // verifico se os dados foram validados
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos!' });
    }

    // verifico se usuario já existe na base
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'Usuário já cadastrado!' });
    }

    // cadastro o usuário na base
    const { id, name, email, provider } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    // validação dos dados com yup
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    // verifico se os dados foram validados
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos!' });
    }

    // verifico se o email que está sendo enviado é igual ao email na base
    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'Usuário já cadastrado!' });
      }
    }

    // verifico se o email que foi enviado confere com o que está no banco
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      res.status(401).json({ error: 'Senha Atual incorreta!' });
    }

    // altero o usuario na base
    await user.update(req.body);

    const { id, name, avatar } = User.findByPk(req.userId, {
      include: [
        { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
      ],
    });
    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }
}

export default new UserController();
