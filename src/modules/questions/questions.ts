import { QuestionCollection } from 'inquirer';
import { MenuEntry } from './model';

export const mainMenuQuestions: QuestionCollection<{ choice: MenuEntry }> = [
  {
    type: 'list',
    name: 'choice',
    message: 'What do you want to do ?',
    choices: [
      {
        name: 'Preview maintenance page',
        value: MenuEntry.TEST_PAGE,
      },
      {
        name: 'Generate maintenance page',
        value: MenuEntry.GENERATE_FILE,
      },
      {
        name: 'Generate maintenance docker image',
        value: MenuEntry.GENERATE_DOCKER,
      },
    ],
  },
];

export const fileNameQuestions: QuestionCollection<{ fileName: string }> = [
  {
    type: 'input',
    name: 'fileName',
    message: 'Enter a filename (default: maintenance.html)',
  },
];
