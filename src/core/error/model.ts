import * as TE from 'fp-ts/TaskEither';

export type MpgTask<T> = TE.TaskEither<Error, T>;
