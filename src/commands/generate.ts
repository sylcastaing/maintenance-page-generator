import { Command, flags } from '@oclif/command';

import cli from 'cli-ux';
import { getConfig } from '../modules/config';
import { runMpgTask } from '../core/error/utils';
import { compileTemplate } from '../modules/template/service';
import { writeFile } from '../modules/files';

import * as TO from 'fp-ts-contrib/TaskOption';
import { pipe } from 'fp-ts/function';

export default class Generate extends Command {
  static description = 'generate an html maintenance page';

  static examples = ['$ mpg generate'];

  static flags = {
    help: flags.help({ char: 'h' }),
    file: flags.string({ char: 'f', description: 'Destination html file name ' }),
  };

  private getDestinationFileName(nameFromFlags?: string): Promise<string> {
    return pipe(
      TO.fromNullable(nameFromFlags),
      TO.getOrElse(() => () => cli.prompt('File name', { default: 'maintenance.html' })),
    )();
  }

  async run() {
    const { flags } = this.parse(Generate);

    cli.action.start('Extracting configuration');

    const config = await getConfig()();

    cli.action.stop('done');

    cli.action.start('Compiling template');

    const template = await runMpgTask(compileTemplate(config));

    cli.action.stop('done');

    const name = await this.getDestinationFileName(flags.file);

    cli.action.start(`Writing template in ${name}`);

    await runMpgTask(writeFile(name, template));

    cli.action.stop('done');
  }
}
