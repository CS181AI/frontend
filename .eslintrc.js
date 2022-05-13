module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: [
    'vue',
    '@typescript-eslint',
  ],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    // 支持import devDependencies
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: true },
    ],
    // 支持for中使用unary operator
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
  },
  settings: {
    // 安装eslint-import-resolver-typescript后在此配置import/resolver，即可读取项目根目录下tsconfig.json中的路径别名设置
    'import/resolver': {
      typescript: {},
    },
  },
};