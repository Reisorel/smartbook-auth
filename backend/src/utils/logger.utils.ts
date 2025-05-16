import { ENV } from '../config/env.config';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Logger simple avec différents niveaux de log
 */
class Logger {
  private static formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` - ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
  }

  /**
   * Log un message de niveau "info"
   */
  public static info(message: string, meta?: any): void {
    console.log(this.formatMessage('info', message, meta));
  }

  /**
   * Log un message de niveau "warn"
   */
  public static warn(message: string, meta?: any): void {
    console.warn(this.formatMessage('warn', message, meta));
  }

  /**
   * Log un message de niveau "error"
   */
  public static error(message: string, error?: Error, meta?: any): void {
    console.error(this.formatMessage('error', message, meta));
    if (error && error.stack && ENV.NODE_ENV === 'development') {
      console.error(error.stack);
    }
  }

  /**
   * Log un message de niveau "debug" (uniquement en développement)
   */
  public static debug(message: string, meta?: any): void {
    if (ENV.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }
}

export default Logger;
