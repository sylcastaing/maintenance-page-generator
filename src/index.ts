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
import { generateDockerImage } from './modules/docker';

const program = Do(TE.taskEither)
  .do(TE.rightIO<MpgError, void>(displayBanner()))
  .bind('config', TE.rightTask(getConfig()))
  .bindL('template', ({ config }) => compileTemplate(config))
  .bind('menu', TE.rightTask(displayMenu()))
  .doL(({ menu, template, config }) => {
    switch (menu) {
      case MenuEntry.TEST_PAGE:
        return TE.fromIOEither(createHttpServer(template));
      case MenuEntry.GENERATE_FILE:
        return saveTemplateFile(template);
      case MenuEntry.GENERATE_DOCKER:
        return generateDockerImage(config, template);
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
