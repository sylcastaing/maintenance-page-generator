#!/usr/bin/env node

import { Do } from 'fp-ts-contrib/lib/Do';
import * as TE from 'fp-ts/lib/TaskEither';
import * as EI from 'fp-ts/lib/Either';

import { getConfig } from './modules/config';
import { displayBanner, displayError } from './modules/display';
import { displayMenu, MenuEntry } from './modules/questions';
import { compileTemplate, saveTemplateFile } from './modules/template';
import { MpgError } from './modules/errors';
import { createHttpServer } from './modules/http';

const program = Do(TE.taskEither)
  .do(TE.rightIO<MpgError, void>(displayBanner()))
  .bind('config', TE.rightTask(getConfig()))
  .bindL('template', ({ config }) => compileTemplate(config))
  .bind('menu', TE.rightTask(displayMenu()))
  .doL(({ menu, template }) => {
    if (MenuEntry.TEST_PAGE === menu) {
      return TE.fromIOEither(createHttpServer(template));
    } else if (MenuEntry.GENERATE_FILE === menu) {
      return saveTemplateFile(template);
    } else {
      return TE.left({ module: 'Template', message: 'azeaze' });
    }
  })
  .return(res => res);

program().then(res => {
  if (EI.isLeft(res)) {
    displayError(res.left)();
  } else {
    //console.log(res.right);
  }
});
