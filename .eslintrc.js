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
    // 关闭class中函数this检查
    'class-methods-use-this': 'off',
    'no-restricted-syntax': 'off',
    'no-constant-condition': 'off',
    'no-param-reassign': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
  },
  settings: {
    // 安装eslint-import-resolver-typescript后在此配置import/resolver，即可读取项目根目录下tsconfig.json中的路径别名设置
    'import/resolver': {
      typescript: {},
    },
  },
};
