const esbuild = require('esbuild')
const esbuildPluginTsc = require('esbuild-plugin-tsc');

esbuild.build({
  outbase: '.',
  entryPoints: ['./index.ts'],
  outfile: 'lib/index.js',
  bundle: true,
  minify: true,
  platform: "node",
  treeShaking: true,
  sourcemap: true,
  plugins: [
    esbuildPluginTsc()
  ]
})



