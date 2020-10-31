import { defaultMpgConfigFile, MpgConfig, MpgConfigFile, MpgExtraConfig } from './model';

import { pipe } from 'fp-ts/function';
import { findImage, getDirContent, getFileBuffer, getFileContent } from '../files';

import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts-contrib/TaskOption';
import * as IOE from 'fp-ts/IOEither';
import * as O from 'fp-ts/Option';
import { identity } from 'fp-ts/function';
import { sequenceS } from 'fp-ts/Apply';

const CONFIG_FILE_NAME = 'mpg.config.json';

function getConfigFile(): T.Task<MpgConfigFile> {
  const parseConfigFile = (content: string): TO.TaskOption<MpgConfigFile> =>
    pipe(
      IOE.tryCatch(() => JSON.parse(content), identity),
      TE.fromIOEither,
      TO.fromTaskEither,
    );

  return pipe(
    getFileContent(CONFIG_FILE_NAME),
    TO.chain(parseConfigFile),
    TO.getOrElse(() => T.of(defaultMpgConfigFile)),
  );
}

function getExtraConfig(): T.Task<MpgExtraConfig> {
  return pipe(
    getDirContent(process.cwd()),
    TO.getOrElse<Array<string>>(() => T.of([])),
    T.chain(files =>
      sequenceS(T.task)({
        favicon: getFileBuffer('favicon.ico'),
        background: findImage('background', files),
        logo: findImage('logo', files),
        style: getFileContent('style.css'),
      }),
    ),
    T.map(({ favicon, background, logo, style }) => ({
      favicon: O.toNullable(favicon),
      background: O.toNullable(background),
      logo: O.toNullable(logo),
      style: O.toNullable(style),
    })),
  );
}

export function getConfig(): T.Task<MpgConfig> {
  return pipe(
    sequenceS(T.task)({
      config: getConfigFile(),
      extra: getExtraConfig(),
    }),
    T.map(({ config, extra }) => ({
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
    })),
  );
}
