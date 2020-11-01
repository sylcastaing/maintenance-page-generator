import { Command, flags } from '@oclif/command';
import { runMpgTask } from '../core/error/utils';
import { buildDockerImage } from '../modules/docker';
import { pipe } from 'fp-ts/function';
import * as TO from 'fp-ts-contrib/TaskOption';
import cli from 'cli-ux';

export default class Docker extends Command {
  static description = 'build a maintenance docker image';

  static examples = ['$ mpg docker'];

  static flags = {
    help: flags.help({ char: 'h' }),
    tagName: flags.string({ char: 't', description: 'Docker image tag name' }),
  };

  private getDestinationFileName(nameFromFlags?: string): Promise<string> {
    return pipe(
      TO.fromNullable(nameFromFlags),
      TO.getOrElse(() => () => cli.prompt('Tag name', { default: 'maintenance:latest' })),
    )();
  }

  async run() {
    const { flags } = this.parse(Docker);

    const tagName = await this.getDestinationFileName(flags.tagName);

    await runMpgTask(buildDockerImage(tagName));
  }
}
