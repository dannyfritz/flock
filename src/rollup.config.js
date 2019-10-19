import typescript from "rollup-plugin-typescript2";

module.exports = {
  input: 'index.ts',
  output: {
    file: 'index.js',
    format: 'cjs',
  },
  plugins: [
    typescript(),
  ]
};
