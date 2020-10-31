import { Command, flags } from '@oclif/command';

import cli from 'cli-ux';
import { createPreviewHttpServer } from '../modules/http';

export default class Preview extends Command {
  static description = 'preview maintenance page in browser';

  static examples = ['$ mpg preview'];

  static flags = {
    help: flags.help({ char: 'h' }),
    port: flags.integer({ char: 'p', description: 'Server port', default: 8080 }),
    livereload: flags.integer({ char: 'l', description: 'Livereload server port', default: 35729 }),
  };

  async run() {
    const { flags } = this.parse(Preview);

    cli.action.start(`Maintenance page preview is available on http://localhost:${flags.port}`, 'running', {
      stdout: true,
    });

    createPreviewHttpServer(flags.port, flags.livereload);

    await cli.open(`http://localhost:${flags.port}`);
  }
}
