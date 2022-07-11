let testRegex = '\\.(js)$';
switch (process.env.TEST_MODE) {
  case 'unit':
    testRegex = '\\.unit' + testRegex;
    break;
  case 'int':
    testRegex = '\\.int' + testRegex;
    break;

  default:
    throw new Error(`Unknown testRegex: ${testRegex}`);
}

module.exports = {
  testEnvironment: 'node',
  testRegex,
  moduleFileExtensions: ['js'],
};
