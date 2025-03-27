// @ts-nocheck
import { Gelf } from 'gelf-pro';
import os from 'os';

const logger = new Gelf({
  adapterName: 'udp',
  adapterOptions: {
    host: 'localhost',
    port: 12201,
  },
  fields: {
    facility:  'unknown-service',
    host: os.hostname(),
    environment: 'development'
  },
});

export const logInfo = (message: string, additionalData = {}) => {
  logger.info(message, additionalData);
};

export const logError = (message: string, error: any, additionalData = {}) => {
  logger.error(message, {
    ...additionalData,
    error: error.message,
    stack: error.stack
  });
};

export const logWarn = (message: string, additionalData = {}) => {
  logger.warn(message, additionalData);
};

export default logger;