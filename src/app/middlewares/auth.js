import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'token não enviado na requisição!' });
  }

  const [, token] = authHeader.split(' ');

  try {
    // utilizo promisify para poder utilizar await ao invés de chamadas com calback de retorno
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
    return next();
  } catch (error) {
    res.status(401).json({ error: 'token inválido!' });
  }
};
