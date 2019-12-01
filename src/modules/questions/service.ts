import inquirer from 'inquirer';

import { MenuEntry } from './model';

import { fileNameQuestions, mainMenuQuestions } from './questions';

import * as T from 'fp-ts/lib/Task';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

const prompt = inquirer.createPromptModule();

export function displayMenu(): T.Task<MenuEntry> {
  return pipe(
    () => prompt(mainMenuQuestions),
    T.map(res => res.choice),
  );
}

export function displayFileNameQuestion(): T.Task<string> {
  return pipe(
    () => prompt(fileNameQuestions),
    T.map(res =>
      pipe(
        O.fromNullable(res.fileName),
        O.filter(name => name !== ''),
        O.getOrElse(() => 'maintenance.html'),
      ),
    ),
  );
}
