/* eslint-disable */
// @ts-nocheck
import gelf from 'gelf-pro';
import os from 'os';

// Configure the logger
gelf.setConfig({
  fields: {
    facility: process.env.SERVICE_NAME || 'unknown-service',
    host: os.hostname(),
    environment: process.env.NODE_ENV || 'development'
  },
  adapterOptions: {
    host: process.env.GRAYLOG_HOST || 'localhost',
    port: 12201,
  },
  adapterName: 'udp'
});

export const logInfo = (message: string, additionalData = {}) => {
  gelf.info(message, additionalData);
};

export const logError = (message: string, error: any, additionalData = {}) => {
  gelf.error(message, {
    ...additionalData,
    error: error.message,
    stack: error.stack
  });
};

export const logWarn = (message: string, additionalData = {}) => {
  gelf.warn(message, additionalData);
};

export default gelf;