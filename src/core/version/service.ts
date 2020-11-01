const pjson = require('../../../package.json');

export function getMpgVersion(): string {
  return pjson.version;
}
