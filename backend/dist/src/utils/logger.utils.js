"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_config_1 = require("../config/env.config");
/**
 * Logger simple avec différents niveaux de log
 */
class Logger {
    static formatMessage(level, message, meta) {
        const timestamp = new Date().toISOString();
        const metaString = meta ? ` - ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
    }
    /**
     * Log un message de niveau "info"
     */
    static info(message, meta) {
        console.log(this.formatMessage('info', message, meta));
    }
    /**
     * Log un message de niveau "warn"
     */
    static warn(message, meta) {
        console.warn(this.formatMessage('warn', message, meta));
    }
    /**
     * Log un message de niveau "error"
     */
    static error(message, error, meta) {
        console.error(this.formatMessage('error', message, meta));
        if (error && error.stack && env_config_1.ENV.NODE_ENV === 'development') {
            console.error(error.stack);
        }
    }
    /**
     * Log un message de niveau "debug" (uniquement en développement)
     */
    static debug(message, meta) {
        if (env_config_1.ENV.NODE_ENV === 'development') {
            console.debug(this.formatMessage('debug', message, meta));
        }
    }
}
exports.default = Logger;
