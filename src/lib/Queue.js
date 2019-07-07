import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

// para cada job criamos uma fila e armazenamos no array jobs
const jobs = [CancellationMail];

class Queue {
  constructor() {
    /* pego todos os jobs da minha aplicação e armazeno na variável queues */
    this.queues = {};
    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        /* dentro da fila armazenamos a instancia do Bee que faz a comunicação
        com o redis e seta configurações da fila, conexão com banco etc...
        */
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle, // função que executará o job
      };
    });
  }

  // adicionar um novo job a fila
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      /*
       * bee =  fila do job
       * handle =  tarefa a ser processada na fila
       */
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure()).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}
export default new Queue();
