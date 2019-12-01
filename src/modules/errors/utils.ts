import { MgpError, ModuleError } from './model';

export function mapErrorToMpgError(module: ModuleError): (err: Error) => MgpError {
  return err => ({
    module,
    message: err.message,
  });
}
