module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'no-unused-vars': ['warning', { args: 'none' }],
    // 'import/no-unused-modules': [1, { unusedExports: true }],
    // 'react/react-in-jsx-scope': 'off', // If using React 17+ with new JSX Transform
  },
}
