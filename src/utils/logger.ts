export class Logger {
    private namespace: string;
    private debugMode: boolean;

    constructor(namespace: string, debugMode = false) {
        this.namespace = namespace;
        this.debugMode = debugMode;
    }

    private formatMessage(level: string, ...args: any[]): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${this.namespace}] [${level.toUpperCase()}]`;
    }

    info(...args: any[]): void {
        console.log(this.formatMessage('info'), ...args);
        this.writeToVaultLog('INFO', ...args);
    }

    warn(...args: any[]): void {
        console.warn(this.formatMessage('warn'), ...args);
        this.writeToVaultLog('WARN', ...args);
    }

    error(...args: any[]): void {
        console.error(this.formatMessage('error'), ...args);
        this.writeToVaultLog('ERROR', ...args);
    }

    debug(...args: any[]): void {
        if (this.debugMode) {
            console.debug(this.formatMessage('debug'), ...args);
            this.writeToVaultLog('DEBUG', ...args);
        }
    }

    private writeToVaultLog(level: string, ...args: any[]): void {
        // TODO: Implement vault logging
        // This will write logs to a specific file in the vault
        const logEntry = `${this.formatMessage(level)} ${args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : arg
        ).join(' ')}\n`;

        // Placeholder for actual vault file writing
        // Will be implemented when we have access to Obsidian's vault API
        console.log('Vault Log:', logEntry);
    }
}
