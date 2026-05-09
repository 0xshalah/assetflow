/**
 * Structured logger for AssetFlow.
 * Outputs JSON logs for easy parsing by log aggregators (Vercel Logs, Datadog, etc.)
 *
 * SECURITY: Never log PII fields (borrowerContact, passwords, tokens).
 *
 * Usage:
 *   logger.info('Item created', { itemId: '...', userId: '...' });
 *   logger.error('Failed to create loan', { error: e.message, itemId: '...' });
 */

type LogLevel = 'info' | 'warn' | 'error' | 'audit';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

function createLog(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context && { context })
  };
}

function emit(entry: LogEntry) {
  const output = JSON.stringify(entry);

  switch (entry.level) {
    case 'error':
      console.error(output);
      break;
    case 'warn':
      console.warn(output);
      break;
    default:
      console.log(output);
  }
}

export const logger = {
  info(message: string, context?: Record<string, unknown>) {
    emit(createLog('info', message, context));
  },

  warn(message: string, context?: Record<string, unknown>) {
    emit(createLog('warn', message, context));
  },

  error(message: string, context?: Record<string, unknown>) {
    emit(createLog('error', message, context));
  },

  /**
   * Audit log — for tracking user actions (create, update, delete, return).
   * These should never be suppressed in production.
   */
  audit(action: string, context?: Record<string, unknown>) {
    emit(createLog('audit', action, context));
  }
};
