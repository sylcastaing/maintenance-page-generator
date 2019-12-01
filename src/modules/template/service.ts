import pug from 'pug';
import * as path from 'path';
import * as fs from 'fs';

import { MpgConfig } from '../config';
import { mapErrorToMpgError, MpgTask } from '../errors';

import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import { displayFileNameQuestion } from '../questions';

const parseError = mapErrorToMpgError('Template');

const compiledFunction = pug.compileFile(path.join(__dirname, '../../../views/page.pug'));

export function compileTemplate(config: MpgConfig): MpgTask<string> {
  try {
    const html = compiledFunction(config);
    return TE.right(html);
  } catch (err) {
    return TE.left(parseError(err));
  }
}

export function saveTemplateFile(html: string): MpgTask<boolean> {
  return pipe(
    TE.rightTask(displayFileNameQuestion()),
    TE.chain(name => {
      try {
        fs.writeFileSync(name, html);

        return TE.right(true);
      } catch (err) {
        return TE.left(parseError(err));
      }
    }),
  );
}
