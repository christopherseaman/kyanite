import { Plugin, MarkdownView, Notice } from 'obsidian';
import { KyaniteSettings } from './services/settings';
import { ContextManager } from './services/context-manager';
import { DocumentAgent } from './components/agents/base-agent';
import { AnthropicProvider } from './api/providers/anthropic';
import { Logger } from './utils/logger';

export default class KyanitePlugin extends Plugin {
    settings: KyaniteSettings;
    contextManager: ContextManager;
    logger: Logger;
    anthropicProvider: AnthropicProvider;

    async onload() {
        // Initialize settings
        await this.loadSettings();

        // Setup logging
        this.logger = new Logger(this.manifest.id);
        this.logger.info('Kyanite plugin loaded');

        // Initialize context manager
        this.contextManager = new ContextManager(this.app);

        // Setup Anthropic provider
        this.anthropicProvider = new AnthropicProvider(
            this.settings.anthropicApiKey
        );

        // Add commands, ribbons, status bars etc.
        this.addCommands();
    }

    onunload() {
        this.logger.info('Kyanite plugin unloaded');
    }

    async loadSettings() {
        this.settings = Object.assign(
            {}, 
            KyaniteSettings.DEFAULT_SETTINGS, 
            await this.loadData()
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    addCommands() {
        // Add plugin-specific commands
        this.addCommand({
            id: 'create-document',
            name: 'Create Document',
            callback: () => {
                // Placeholder for document creation logic
                new Notice('Document creation initiated');
            }
        });

        this.addCommand({
            id: 'analyze-vault',
            name: 'Analyze Vault',
            callback: async () => {
                try {
                    const context = await this.contextManager.scanVault();
                    this.logger.info('Vault analysis complete', context);
                } catch (error) {
                    this.logger.error('Vault analysis failed', error);
                }
            }
        });
    }
}
