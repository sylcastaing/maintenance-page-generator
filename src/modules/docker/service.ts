import * as execa from 'execa';

import * as path from 'path';

import { MpgTask } from '../../core/error';
import { promiseToMpgTask } from '../../core/error/utils';
import { constVoid, pipe } from 'fp-ts/function';

import * as TE from 'fp-ts/TaskEither';
import { getMpgVersion } from '../../core/version';

export function buildDockerImage(dir: string, tagName: string): MpgTask<void> {
  const executor = execa('docker', [
    'build',
    path.join(process.cwd(), dir),
    '-t',
    tagName,
    '-f',
    path.join(__dirname, '../../docker/Dockerfile'),
    '--build-arg',
    `version=${getMpgVersion()}`,
  ]);

  executor.stdout?.pipe(process.stdout);

  return pipe(
    promiseToMpgTask(() => executor),
    TE.map(constVoid),
  );
}
