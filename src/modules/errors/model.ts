import * as TE from 'fp-ts/lib/TaskEither';

export type ModuleError = 'Config' | 'Template' | 'Http' | 'Docker';

export interface MpgError {
  module: ModuleError;
  message: string;
}

export type MpgTask<T> = TE.TaskEither<MpgError, T>;
