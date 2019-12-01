import { MpgError, ModuleError } from './model';

export function mapErrorToMpgError(module: ModuleError): (err: Error) => MpgError {
  return (err): MpgError => ({
    module,
    message: err.message,
  });
}
