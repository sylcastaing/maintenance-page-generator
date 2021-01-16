import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

import * as mimetypes from 'mime-types';

import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts-contrib/TaskOption';
import * as A from 'fp-ts/Array';
import { identity, Lazy, pipe } from 'fp-ts/function';
import { MpgTask } from '../../core/error';
import { promiseToMpgTask } from '../../core/error/utils';

const getFileFunction = util.promisify(fs.readFile);
const readDirFunction = util.promisify(fs.readdir);
const writeFileFunction = util.promisify(fs.writeFile);

const IMAGES_EXTENSIONS = ['svg', 'png', 'jpeg', 'jpg'];

function getFile<T>(fn: Lazy<Promise<T>>): TO.TaskOption<T> {
  return pipe(TE.tryCatch(fn, identity), TO.fromTaskEither);
}

export function getFileContent(dir: string, name: string): TO.TaskOption<string> {
  return getFile(() => getFileFunction(path.join(dir, name), 'utf8'));
}

export function getFileBuffer(dir: string, name: string): TO.TaskOption<Buffer> {
  return getFile(() => getFileFunction(path.join(dir, name)));
}

export function getFileToBase64(dir: string, name: string): TO.TaskOption<string> {
  return getFile(() => getFileFunction(path.join(dir, name), 'base64'));
}

export function getDirContent(dir: string, name: string): TO.TaskOption<Array<string>> {
  return pipe(
    TE.tryCatch(() => readDirFunction(path.join(process.cwd(), dir, name)), identity),
    TO.fromTaskEither,
  );
}

function getImageToBase64(dir: string, name: string): TO.TaskOption<string> {
  return pipe(
    getFileToBase64(dir, name),
    TO.map(base64 => `data:${mimetypes.lookup(name)};base64,${base64}`),
  );
}

export function findImage(dir: string, name: string, files: Array<string>): TO.TaskOption<string> {
  return pipe(
    IMAGES_EXTENSIONS,
    A.map(extension => `${name}.${extension}`),
    A.findFirst(name => files.includes(name)),
    TO.fromOption,
    TO.chain(name => getImageToBase64(dir, name)),
  );
}

export function writeFile(name: string, content: string): MpgTask<void> {
  return promiseToMpgTask(() => writeFileFunction(name, content));
}
