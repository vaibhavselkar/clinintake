import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import { logger } from './utils/logger';
import { errorMiddleware } from './middleware/error.middleware';
import intakeRoutes from './routes/intake.routes';
import healthRoutes from './routes/health.routes';

const app = express();

app.use(cors({ origin: config.corsOrigin, methods: ['GET', 'POST', 'DELETE'] }));
app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again shortly.' },
});
app.use('/api', limiter);

app.use('/health', healthRoutes);
app.use('/api/intake', intakeRoutes);

app.use(errorMiddleware);

app.listen(config.port, () => {
  logger.info(`ClinIntake backend running on port ${config.port} [${config.nodeEnv}]`);
});

export default app;
