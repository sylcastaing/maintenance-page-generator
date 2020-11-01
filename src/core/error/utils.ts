import { Lazy, pipe } from 'fp-ts/function';
import { MpgTask } from './model';

import * as TE from 'fp-ts/TaskEither';
import * as EI from 'fp-ts/Either';
import * as IOE from 'fp-ts/IOEither';

export function mapMpgError(err: unknown): Error {
  if (typeof err === 'string') {
    return new Error(err);
  }

  return err as Error;
}

export function promiseToMpgTask<T, P extends Promise<T>>(fn: Lazy<P>): MpgTask<T> {
  return TE.tryCatch(fn, mapMpgError);
}

export function ioToMpgTask<T>(fn: Lazy<T>): MpgTask<T> {
  return pipe(IOE.tryCatch(fn, mapMpgError), TE.fromIOEither);
}

export function runMpgTask<T>(task: MpgTask<T>): Promise<T> {
  return task().then(res => {
    if (EI.isRight(res)) {
      return res.right;
    }

    throw res.left;
  });
}
