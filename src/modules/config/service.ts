import * as A from 'fp-ts/lib/Array';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import * as O from 'fp-ts/lib/Option';
import { defaultMpgConfigFile, MpgConfig, MpgConfigFile, MpgExtraConfig } from './model';
import fs from 'fs';
import { pipe } from 'fp-ts/lib/pipeable';
import { Do } from 'fp-ts-contrib/lib/Do';

import mimetypes from 'mime-types';
import { CONFIG_FILE_NAME } from '../../constants';

function getFile(name: string): T.Task<O.Option<string>> {
  try {
    const buf = fs.readFileSync(name, 'utf8');

    return T.of(O.some(buf.toString()));
  } catch (e) {
    return T.of(O.none);
  }
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

function findImage(files: Array<string>, name: string): O.Option<string> {
  return pipe(
    extensions.map(ext => `${name}.${ext}`),
    A.findFirst(name => files.includes(name)),
  );
}

function encodeImage(file: string): string {
  const base64 = fs.readFileSync(file, 'base64');

  const mimetype = mimetypes.lookup(file);

  return `data:${mimetype};base64,${base64}`;
}

function getExtraConfig(): T.Task<MpgExtraConfig> {
  const files = fs.readdirSync(process.cwd());

  const getImage = (name: string): string | null => pipe(findImage(files, name), O.map(encodeImage), O.toNullable);

  const logo = getImage('logo');
  const background = getImage('background');

  return pipe(
    getFile('style.css'),
    T.map(style => ({
      logo,
      background,
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
      background: extra.background,
      logo: extra.logo,
      style: extra.style,
    }));
}
