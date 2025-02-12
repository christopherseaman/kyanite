import { App, PluginSettingTab, Setting } from 'obsidian';
import KyanitePlugin from '../main';

export class KyaniteSettings {
    // Default settings
    static DEFAULT_SETTINGS = {
        anthropicApiKey: '',
        debugMode: false,
        maxContextTokens: 4000,
        agentBehavior: 'balanced'
    };

    anthropicApiKey: string;
    debugMode: boolean;
    maxContextTokens: number;
    agentBehavior: 'conservative' | 'balanced' | 'creative';
}

export class KyaniteSettingTab extends PluginSettingTab {
    plugin: KyanitePlugin;

    constructor(app: App, plugin: KyanitePlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        // API Key Setting
        new Setting(containerEl)
            .setName('Anthropic API Key')
            .setDesc('Enter your Anthropic API key for AI interactions')
            .addText(text => text
                .setPlaceholder('Enter your API key')
                .setValue(this.plugin.settings.anthropicApiKey)
                .onChange(async (value) => {
                    this.plugin.settings.anthropicApiKey = value.trim();
                    await this.plugin.saveSettings();
                })
            );

        // Debug Mode Setting
        new Setting(containerEl)
            .setName('Debug Mode')
            .setDesc('Enable detailed logging for troubleshooting')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.debugMode)
                .onChange(async (value) => {
                    this.plugin.settings.debugMode = value;
                    await this.plugin.saveSettings();
                })
            );

        // Context Token Limit
        new Setting(containerEl)
            .setName('Max Context Tokens')
            .setDesc('Maximum number of tokens to use for context')
            .addText(text => text
                .setPlaceholder('4000')
                .setValue(this.plugin.settings.maxContextTokens.toString())
                .onChange(async (value) => {
                    const parsedValue = parseInt(value, 10);
                    this.plugin.settings.maxContextTokens = 
                        isNaN(parsedValue) ? 4000 : parsedValue;
                    await this.plugin.saveSettings();
                })
            );

        // Agent Behavior Setting
        new Setting(containerEl)
            .setName('Agent Behavior')
            .setDesc('Adjust the creativity and risk-taking of the AI agent')
            .addDropdown(dropdown => dropdown
                .addOptions({
                    'conservative': 'Conservative',
                    'balanced': 'Balanced',
                    'creative': 'Creative'
                })
                .setValue(this.plugin.settings.agentBehavior)
                .onChange(async (value) => {
                    this.plugin.settings.agentBehavior = 
                        value as 'conservative' | 'balanced' | 'creative';
                    await this.plugin.saveSettings();
                })
            );
    }
}
