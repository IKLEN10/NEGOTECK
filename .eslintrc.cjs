module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  // `dist` es la carpeta de salida del build (código minificado, no fuente);
  // sin este ignore, correr `npm run build` seguido de `npm run lint` hace
  // que ESLint intente analizar el bundle minificado como si fuera código
  // fuente, produciendo cientos de errores falsos.
  ignorePatterns: ['dist'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: { react: { version: 'detect' } },
  plugins: ['react-refresh'],
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': 'warn',
  },
}
