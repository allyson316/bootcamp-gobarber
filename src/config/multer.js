// módulo com configurações para salvar arquivo de avatar
import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    // destino onde o arquivo será salvo
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // nome único que darei ao arquivo
    filename: (req, file, cb) => {
      // cria uma string aleatória para ser adicionada ao nome real do arquivo
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        // exemplo = yuer4545r4t5r.png
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
