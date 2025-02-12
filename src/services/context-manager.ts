import { App, TFile, TFolder } from 'obsidian';
import { Logger } from '../utils/logger';

export interface DocumentContext {
    path: string;
    content: string;
    tags: string[];
    links: string[];
    lastModified: number;
}

export class ContextManager {
    private app: App;
    private logger: Logger;

    constructor(app: App) {
        this.app = app;
        this.logger = new Logger('ContextManager');
    }

    async scanVault(): Promise<DocumentContext[]> {
        const contexts: DocumentContext[] = [];
        
        const processFolder = async (folder: TFolder) => {
            for (const child of folder.children) {
                if (child instanceof TFolder) {
                    await processFolder(child);
                } else if (child instanceof TFile && child.extension === 'md') {
                    try {
                        const content = await this.app.vault.read(child);
                        contexts.push({
                            path: child.path,
                            content: content,
                            tags: this.extractTags(content),
                            links: this.extractLinks(content),
                            lastModified: child.stat.mtime
                        });
                    } catch (error) {
                        this.logger.error(`Error processing file ${child.path}:`, error);
                    }
                }
            }
        };

        await processFolder(this.app.vault.getRoot());
        
        this.logger.info(`Scanned vault, found ${contexts.length} markdown files`);
        return contexts;
    }

    extractTags(content: string): string[] {
        const tagRegex = /#(\w+)/g;
        const tags: string[] = [];
        let match;
        
        while ((match = tagRegex.exec(content)) !== null) {
            tags.push(match[1]);
        }
        
        return tags;
    }

    extractLinks(content: string): string[] {
        const linkRegex = /\[\[([^\]]+)\]\]/g;
        const links: string[] = [];
        let match;
        
        while ((match = linkRegex.exec(content)) !== null) {
            links.push(match[1]);
        }
        
        return links;
    }

    async findRelatedDocuments(context: DocumentContext, maxResults = 5): Promise<DocumentContext[]> {
        const allContexts = await this.scanVault();
        
        // Simple relevance scoring based on shared tags and links
        const scoredContexts = allContexts
            .filter(doc => doc.path !== context.path)
            .map(doc => ({
                document: doc,
                score: this.calculateRelevanceScore(context, doc)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, maxResults);
        
        return scoredContexts.map(sc => sc.document);
    }

    private calculateRelevanceScore(source: DocumentContext, target: DocumentContext): number {
        let score = 0;
        
        // Score based on shared tags
        const sharedTags = source.tags.filter(tag => 
            target.tags.includes(tag)
        );
        score += sharedTags.length * 2;
        
        // Score based on shared links
        const sharedLinks = source.links.filter(link => 
            target.links.includes(link)
        );
        score += sharedLinks.length * 3;
        
        return score;
    }
}
