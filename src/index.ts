#!/usr/bin/env node

import inquirer from 'inquirer';

const prompt = inquirer.createPromptModule();

prompt([
  {
    type: 'list',
    name: 'mode',
    message: 'What do you want to do ?',
    choices: [
      {
        name: 'Choice 1 ?',
        value: '1',
      },
      {
        name: 'Choice 2 ?',
        value: '2',
      },
    ],
  },
]).then(console.log);
