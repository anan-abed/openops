/* eslint-disable no-console */
import { FastifyInstance } from 'fastify';
import { logger, sendLogs } from './logger/index';
import { SharedSystemProp, system } from './system';
import { telemetry } from './telemetry/telemetry';

let shuttingDown = false;
const stop = async (app: FastifyInstance): Promise<void> => {
  if (shuttingDown) return;
  shuttingDown = true;

  if (system.getOrThrow(SharedSystemProp.ENVIRONMENT) === 'dev') {
    setTimeout(() => {
      console.log('Dev mode, forcing shutdown after 500 ms');
      process.exit(0);
    }, 500);
  }

  try {
    logger.info('Flushing telemetry...');
    await telemetry.flush();
    logger.info('Closing Fastify....');
    await app.close();
    await sendLogs();
    process.exit(0);
  } catch (err) {
    logger.error('Error stopping app', err);
    await sendLogs();
    process.exit(1);
  }
};

export function setStopHandlers(app: FastifyInstance) {
  process.on('SIGINT', async () => {
    logger.warn('SIGINT received, shutting down');
    stop(app).catch((e) => console.info('Failed to stop the app', e));
  });

  process.on('SIGTERM', async () => {
    logger.warn('SIGTERM received, shutting down');
    stop(app).catch((e) => console.info('Failed to stop the app', e));
  });
}
