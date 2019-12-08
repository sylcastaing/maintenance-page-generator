import * as A from 'fp-ts/lib/Array';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import * as O from 'fp-ts/lib/Option';
import { defaultMpgConfigFile, MpgConfig, MpgConfigFile, MpgExtraConfig } from './model';
import fs from 'fs';
import { pipe } from 'fp-ts/lib/pipeable';
import { Do } from 'fp-ts-contrib/lib/Do';

import util from 'util';

import mimetypes from 'mime-types';
import { CONFIG_FILE_NAME } from '../../constants';
import { constVoid } from 'fp-ts/lib/function';
import { parallelT } from '../../utils/fp';

const getFileFunction = util.promisify(fs.readFile);
const readDirFunction = util.promisify(fs.readdir);

function foldTask<T>(task: TE.TaskEither<unknown, T>): T.Task<O.Option<T>> {
  return pipe(
    task,
    TE.fold(
      () => T.of(O.none),
      right => T.of(O.some(right)),
    ),
  );
}

function getFileBuffer(name: string): T.Task<O.Option<Buffer>> {
  return pipe(
    TE.tryCatch(() => getFileFunction(name), constVoid),
    foldTask,
  );
}

function getFile(name: string): T.Task<O.Option<string>> {
  return pipe(
    TE.tryCatch(() => getFileFunction(name, 'utf8'), constVoid),
    foldTask,
  );
}

function getFileBase64(name: string): T.Task<O.Option<string>> {
  return pipe(
    TE.tryCatch(() => getFileFunction(name, 'base64'), constVoid),
    foldTask,
  );
}

function getConfigFile(): T.Task<MpgConfigFile> {
  return pipe(
    getFile(CONFIG_FILE_NAME),
    T.chain(content =>
      pipe(
        content,
        O.fold(
          () => TE.left('Not found'),
          c => {
            try {
              return TE.right(JSON.parse(c));
            } catch (e) {
              return TE.left('Error during parsing');
            }
          },
        ),
      ),
    ),
    TE.fold(
      () => T.of(defaultMpgConfigFile),
      content => T.of(content),
    ),
  );
}

const extensions = ['svg', 'png', 'jpeg', 'jpg'];

function encodeImage(file: string): T.Task<O.Option<string>> {
  return pipe(
    getFileBase64(file),
    T.map(content =>
      pipe(
        content,
        O.map(base64 => `data:${mimetypes.lookup(file)};base64,${base64}`),
      ),
    ),
  );
}

function findImage(files: Array<string>, name: string): T.Task<O.Option<string>> {
  return pipe(
    extensions.map(ext => `${name}.${ext}`),
    A.findFirst(name => files.includes(name)),
    O.fold(() => T.of(O.none), encodeImage),
  );
}

function getExtraConfig(): T.Task<MpgExtraConfig> {
  return pipe(
    TE.tryCatch(() => readDirFunction(process.cwd()), constVoid),
    TE.fold(
      () => parallelT(T.of(O.none), T.of(O.none), T.of(O.none), T.of(O.none)),
      files =>
        parallelT(
          getFileBuffer('favicon.ico'),
          getFile('style.css'),
          findImage(files, 'logo'),
          findImage(files, 'background'),
        ),
    ),
    T.map(([favicon, style, logo, background]) => ({
      favicon: O.toNullable(favicon),
      logo: O.toNullable(logo),
      background: O.toNullable(background),
      style: O.toNullable(style),
    })),
  );
}

export function getConfig(): T.Task<MpgConfig> {
  return Do(T.task)
    .bind('config', getConfigFile())
    .bind('extra', getExtraConfig())
    .return(({ config, extra }) => ({
      ...defaultMpgConfigFile,
      ...config,
      meta: {
        ...defaultMpgConfigFile.meta,
        ...config.meta,
      },
      favicon: extra.favicon,
      logo: extra.logo,
      background: extra.background,
      style: extra.style,
    }));
}
