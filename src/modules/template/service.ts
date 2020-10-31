import * as pug from 'pug';
import * as path from 'path';

import { MpgConfig } from '../config';
import { MpgTask } from '../../core/error';
import { ioToMpgTask } from '../../core/error/utils';

const compiledFunction = pug.compileFile(path.join(__dirname, '../../views/page.pug'));

export function compileTemplate(config: MpgConfig): MpgTask<string> {
  return ioToMpgTask(() => compiledFunction(config));
}
