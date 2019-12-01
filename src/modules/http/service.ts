import http from 'http';

import ora from 'ora';

import * as IOE from 'fp-ts/lib/IOEither';
import { mapErrorToMpgError, MpgError } from '../errors';

const parseError = mapErrorToMpgError('Http');

export function createHttpServer(html: string): IOE.IOEither<MpgError, void> {
  return IOE.tryCatch(
    () => {
      ora('Preview available on http://127.0.0.1:8080').start();

      http
        .createServer((req, res) => {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
          res.write(html);
          res.end();
        })
        .listen(8080);
    },
    err => parseError(err as Error),
  );
}
