import { DocumentContext } from '../../services/context-manager';
import { AnthropicProvider } from '../../api/providers/anthropic';
import { Logger } from '../../utils/logger';

export interface UserIntent {
    type: 'create' | 'modify' | 'analyze';
    description: string;
}

export interface DocumentProposal {
    type: 'create' | 'modify' | 'refactor';
    targetDocument?: string;
    proposedChanges: string;
    rationale: string;
    impactedDocuments: string[];
}

export interface DocumentChangeResult {
    success: boolean;
    changes: string[];
    errors?: string[];
}

export abstract class DocumentAgent {
    protected logger: Logger;
    protected anthropicProvider: AnthropicProvider;

    constructor(
        anthropicProvider: AnthropicProvider,
        loggerNamespace: string
    ) {
        this.anthropicProvider = anthropicProvider;
        this.logger = new Logger(loggerNamespace);
    }

    // Abstract methods to be implemented by specific agent types
    abstract understand(context: DocumentContext[]): Promise<UserIntent>;
    
    abstract propose(intent: UserIntent, context: DocumentContext[]): Promise<DocumentProposal>;
    
    abstract execute(proposal: DocumentProposal): Promise<DocumentChangeResult>;

    // Utility method for common validation
    protected validateProposal(proposal: DocumentProposal): boolean {
        if (!proposal.proposedChanges) {
            this.logger.warn('Proposal lacks substantive changes');
            return false;
        }

        if (proposal.type === 'modify' && !proposal.targetDocument) {
            this.logger.warn('Modification proposal requires target document');
            return false;
        }

        return true;
    }

    // Helper method to generate rationale using Anthropic
    protected async generateRationale(
        intent: UserIntent, 
        context: DocumentContext[]
    ): Promise<string> {
        try {
            const contextString = context
                .map(doc => `Path: ${doc.path}\nContent: ${doc.content.slice(0, 500)}`)
                .join('\n\n');

            const prompt = `
            Given the following context and user intent, generate a concise rationale:

            User Intent: ${intent.description}
            Vault Context:
            ${contextString}

            Provide a clear, logical explanation for the proposed action.
            `;

            const response = await this.anthropicProvider.generateText({
                prompt: prompt,
                maxTokens: 300
            });

            return response.trim();
        } catch (error) {
            this.logger.error('Failed to generate rationale', error);
            return 'Unable to generate detailed rationale due to an error.';
        }
    }
}

// Specific agent implementations will extend this base class
export class DocumentCreationAgent extends DocumentAgent {
    async understand(context: DocumentContext[]): Promise<UserIntent> {
        // Implement specific understanding logic for document creation
        return {
            type: 'create',
            description: 'Create a new document based on vault context'
        };
    }

    async propose(intent: UserIntent, context: DocumentContext[]): Promise<DocumentProposal> {
        const rationale = await this.generateRationale(intent, context);

        return {
            type: 'create',
            proposedChanges: 'New document content to be generated',
            rationale: rationale,
            impactedDocuments: []
        };
    }

    async execute(proposal: DocumentProposal): Promise<DocumentChangeResult> {
        if (!this.validateProposal(proposal)) {
            return {
                success: false,
                changes: [],
                errors: ['Invalid proposal']
            };
        }

        try {
            // TODO: Implement actual document creation logic
            this.logger.info('Proposed document creation', proposal);

            return {
                success: true,
                changes: ['Created new document'],
                errors: []
            };
        } catch (error) {
            this.logger.error('Document creation failed', error);
            return {
                success: false,
                changes: [],
                errors: [error instanceof Error ? error.message : 'Unknown error']
            };
        }
    }
}
