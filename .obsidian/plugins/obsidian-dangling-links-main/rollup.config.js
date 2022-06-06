import svelte from "rollup-plugin-svelte";
import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import autoPreprocess from "svelte-preprocess";

export default {
  input: 'main.ts',
  output: {
    dir: '.',
    sourcemap: 'inline',
    format: 'cjs',
    exports: 'default'
  },
  external: ['obsidian'],
  plugins: [
    svelte({
      preprocess: autoPreprocess(),
    }),
    typescript(),
    nodeResolve({browser: true, dedupe: ["svelte"]}),
    commonjs(),
  ]
};