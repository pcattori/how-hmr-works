export default (code: string): string =>
  [
    'function (require) {',
    'let module = { exports: {}}',
    code,
    'return module.exports',
    '}',
  ].join('\n')
