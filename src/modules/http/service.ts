import * as http from 'http';
import { pipe } from 'fp-ts/function';
import { getConfig } from '../config';
import { compileTemplate } from '../template/service';

import * as livereload from 'livereload';

import * as T from 'fp-ts/Task';
import * as EI from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { getFileBuffer } from '../files';
import { IncomingMessage, ServerResponse } from 'http';

function templateRoute(res: ServerResponse, livereloadPort: number) {
  pipe(
    getConfig(),
    T.chain(config => compileTemplate({ ...config, livereloadPort })),
    T.chainIOK(result => () => {
      if (EI.isRight(result)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.write(result.right);
      }

      res.end();
    }),
  )();
}

function faviconRoute(res: ServerResponse) {
  pipe(
    getFileBuffer('favicon.ico'),
    T.chainIOK(result => () => {
      if (O.isSome(result)) {
        res.writeHead(200, { 'Content-Type': 'image/x-icon' });
        res.write(result.value);
      } else {
        res.writeHead(404);
      }

      res.end();
    }),
  )();
}

function notFoundRoute(res: ServerResponse) {
  res.writeHead(404);
  res.end();
}

function serverRouter(req: IncomingMessage, res: ServerResponse, livereloadPort: number) {
  switch (req.url) {
    case '/':
      templateRoute(res, livereloadPort);
      break;
    case '/favicon.ico':
      faviconRoute(res);
      break;
    default:
      notFoundRoute(res);
      break;
  }
}

export function createPreviewHttpServer(port: number, livereloadPort: number) {
  http.createServer((req, res) => serverRouter(req, res, livereloadPort)).listen(port);

  livereload
    .createServer({
      port: livereloadPort,
      exts: ['json', 'svg', 'png', 'jpeg', 'jpg', 'css', 'ico'],
      applyCSSLive: false,
      applyImgLive: false,
    })
    .watch(process.cwd());
}
