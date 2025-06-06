import esbuild from "esbuild";
import process from "process";
import builtins from 'builtin-modules'

const banner =
`/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, visit the GitHub repository
*/`;

const prod = (process.argv[2] === 'production');

const config = {
    entryPoints: ['src/main.ts'],
    bundle: true,
    external: [
        'obsidian',
        'electron',
        '@codemirror/autocomplete',
        '@codemirror/collab',
        '@codemirror/commands',
        '@codemirror/language',
        '@codemirror/lint',
        '@codemirror/search',
        '@codemirror/state',
        '@codemirror/view',
        ...builtins
    ],
    format: 'cjs',
    target: ['es2018'],
    sourcemap: prod ? false : 'inline',
    sourcesContent: false,
    minify: prod,
    treeShaking: true,
    outfile: 'main.js',
    banner: {
        js: banner
    }
};

if (prod) {
    config.sourcemap = false;
}

const ctx = await esbuild.context(config);

if (prod) {
    await ctx.rebuild();
    process.exit(0);
} else {
    await ctx.watch();
}
