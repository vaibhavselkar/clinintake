import winston from 'winston';
import { config } from '../config/env';

const { combine, timestamp, json, colorize, simple } = winston.format;

const devFormat = combine(colorize(), timestamp({ format: 'HH:mm:ss' }), simple());
const prodFormat = combine(timestamp(), json());

export const logger = winston.createLogger({
  level: config.logLevel,
  format: config.nodeEnv === 'production' ? prodFormat : devFormat,
  transports: [new winston.transports.Console()],
});
