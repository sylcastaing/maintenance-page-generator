import { defaultMpgConfigFile, MpgConfig, MpgConfigFile, MpgExtraConfig } from './model';

import { identity, pipe } from 'fp-ts/function';
import { findImage, getDirContent, getFileBuffer, getFileContent } from '../files';

import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts-contrib/TaskOption';
import * as IOE from 'fp-ts/IOEither';
import { sequenceS } from 'fp-ts/Apply';

const CONFIG_FILE_NAME = 'mpg.config.json';

function getConfigFile(dir: string): T.Task<MpgConfigFile | null> {
  const parseConfigFile = (content: string): TO.TaskOption<MpgConfigFile> =>
    pipe(
      IOE.tryCatch(() => JSON.parse(content), identity),
      TE.fromIOEither,
      TO.fromTaskEither,
    );

  return pipe(getFileContent(dir, CONFIG_FILE_NAME), TO.chain(parseConfigFile), TO.toNullable);
}

function getExtraConfig(dir: string): T.Task<MpgExtraConfig> {
  return pipe(
    getDirContent(dir, '.'),
    TO.getOrElse<Array<string>>(() => T.of([])),
    T.chain(files =>
      sequenceS(T.task)({
        favicon: TO.toNullable(getFileBuffer(dir, 'favicon.ico')),
        background: TO.toNullable(findImage(dir, 'background', files)),
        logo: TO.toNullable(findImage(dir, 'logo', files)),
        style: TO.toNullable(getFileContent(dir, 'style.css')),
        head: TO.toNullable(getFileContent(dir, 'head.html')),
      }),
    ),
  );
}

export function getConfig(dir: string): T.Task<MpgConfig> {
  return pipe(
    sequenceS(T.task)({
      config: getConfigFile(dir),
      extra: getExtraConfig(dir),
    }),
    T.map(({ config, extra }) => ({
      ...defaultMpgConfigFile,
      ...config,
      meta: {
        ...defaultMpgConfigFile.meta,
        ...config?.meta,
      },
      favicon: extra.favicon,
      logo: extra.logo,
      background: extra.background,
      style: extra.style,
      head: extra.head,
    })),
  );
}
