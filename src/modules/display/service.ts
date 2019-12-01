import * as IO from 'fp-ts/lib/IO';
import chalk from 'chalk';
import figlet from 'figlet';

import { MgpError } from '../errors';

const pjson = require('../../../package.json');

export function displayBanner(): IO.IO<void> {
  return () => {
    console.log(chalk.blue(figlet.textSync('MPG', { horizontalLayout: 'full' })));
    console.log(chalk.blue('Maintenance page generator'));
    console.log(chalk.blue(`v ${pjson.version}`));
    console.log('');
  };
}

export function displayError(error: MgpError): IO.IO<void> {
  return () => {
    console.log(chalk.red(`ERROR : [${error.module}] : ${error.message}`));
  };
}

export function displayLog(message: string): IO.IO<void> {
  return () => {
    console.log(chalk.green(message));
  };
}
