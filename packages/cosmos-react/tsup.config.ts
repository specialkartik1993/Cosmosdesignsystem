import { defineConfig } from 'tsup';
import { readdirSync } from 'fs';
import { resolve } from 'path';

// ----------------------------------------------------------------
// Automatically discover every component source file so we produce
// one entry per component, enabling deep imports such as:
//
//   import { Button } from '@cosmos-ds/react/button';
//
// Plus a barrel "index" entry for the convenience import:
//
//   import { Button, Badge, Card } from '@cosmos-ds/react';
// ----------------------------------------------------------------

const SRC_DIR = resolve(__dirname, '../../src/app/components/ui');

/** Files we want as individual entry points (skip test files) */
const componentFiles = readdirSync(SRC_DIR)
  .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
  .filter(f => !f.includes('.test.') && !f.includes('.spec.'));

/** Build a { name: path } entry map */
const entry: Record<string, string> = {};
for (const file of componentFiles) {
  const name = file.replace(/\.(tsx?|ts)$/, '');
  entry[name] = resolve(SRC_DIR, file);
}

export default defineConfig([
  // ── Main library build ──────────────────────────────────────────
  {
    entry,
    format: ['esm', 'cjs'],
    dts: true,
    splitting: true,
    treeshake: true,
    clean: true,
    minify: false,            // Leave minification to the consumer's bundler
    sourcemap: true,
    outDir: 'dist',

    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'tailwindcss',
    ],

    // Preserve "use client" directives for RSC compatibility
    esbuildOptions(options) {
      options.banner = {
        js: '"use client";',
      };
    },

    onSuccess: 'echo "Build complete: @cosmos-ds/react"',
  },

  // ── CSS bundle ──────────────────────────────────────────────────
  // Ships the base design tokens stylesheet so consumers can add:
  //   import '@cosmos-ds/react/styles.css';
  // or reference the CSS vars in their own Tailwind config.
  {
    entry: {
      styles: resolve(__dirname, '../../src/styles/theme.css'),
    },
    outDir: 'dist',
    clean: false, // Don't wipe previous JS output
  },
]);
