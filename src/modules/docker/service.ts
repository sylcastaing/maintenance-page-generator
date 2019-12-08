import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import { constVoid } from 'fp-ts/lib/function';

import { DOCKER_BUILD_FOLDER } from '../../constants';

import { mapErrorToMpgError, MpgError, MpgTask } from '../errors';

import execa from 'execa';
import rimraf from 'rimraf';
import util from 'util';
import * as fs from 'fs';
import * as path from 'path';

const mapError = mapErrorToMpgError('Docker');
const mapUnknownError = (err: unknown): MpgError => mapError(err as Error);

const createDirFunction = util.promisify(fs.mkdir);
const removeDirFunction = util.promisify(rimraf);
const writeFileFunction = util.promisify(fs.writeFile);
const readFileFunction = util.promisify(fs.readFile);

function createDir(name: string): MpgTask<void> {
  return TE.tryCatch(() => createDirFunction(name), mapUnknownError);
}

function removeDir(name: string): MpgTask<void> {
  return TE.tryCatch(() => removeDirFunction(name), mapUnknownError);
}

function writeFile(name: string, content: string | Buffer): MpgTask<void> {
  return TE.tryCatch(() => writeFileFunction(name, content), mapUnknownError);
}

function createBuildFolder(): MpgTask<void> {
  return createDir(DOCKER_BUILD_FOLDER);
}

function removeBuildFolder(): MpgTask<void> {
  return removeDir(DOCKER_BUILD_FOLDER);
}

function createDockerFile(): MpgTask<void> {
  return pipe(
    TE.tryCatch(() => readFileFunction(path.join(__dirname, '../../../config/Dockerfile')), mapUnknownError),
    TE.chain(content => writeFile(`${DOCKER_BUILD_FOLDER}/Dockerfile`, content)),
  );
}

function createNginxConf(): MpgTask<void> {
  return pipe(
    TE.tryCatch(() => readFileFunction(path.join(__dirname, '../../../config/nginx.conf')), mapUnknownError),
    TE.chain(content => writeFile(`${DOCKER_BUILD_FOLDER}/nginx.conf`, content)),
  );
}

function createHtmlFile(template: string): MpgTask<void> {
  return writeFile(`${DOCKER_BUILD_FOLDER}/maintenance.html`, template);
}

function generateBuildFolder(template: string): MpgTask<void> {
  return pipe(
    removeBuildFolder(),
    TE.chain(createBuildFolder),
    TE.chain(() => createHtmlFile(template)),
    TE.chain(createDockerFile),
    TE.chain(createNginxConf),
  );
}

function buildDockerImage(): MpgTask<void> {
  const executor = execa('docker', ['build', DOCKER_BUILD_FOLDER, '-t', 'maintenance:latest']);

  executor.stdout?.pipe(process.stdout);

  return pipe(
    TE.tryCatch(
      () => executor,
      err => {
        console.log(err);

        return mapUnknownError(err);
      },
    ),
    TE.map(() => constVoid()),
  );
}

export function generateDockerImage(template: string): MpgTask<void> {
  return pipe(generateBuildFolder(template), TE.chain(buildDockerImage), TE.chain(removeBuildFolder));
}
