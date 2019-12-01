import * as TE from 'fp-ts/lib/TaskEither';

export type ModuleError = 'Config' | 'Template' | 'Http';

export interface MgpError {
  module: ModuleError;
  message: string;
}

export type MpgTask<T> = TE.TaskEither<MgpError, T>;
