import { Task, task } from 'fp-ts/lib/Task';
import { array } from 'fp-ts/lib/Array';

const sequenceTaskArray = array.sequence(task);

/**
 * Parallel Task Either
 *
 * Can start parallel TE with types Right array
 *
 * (1 to 4) TE in parallel
 */
export function parallelT<A>(a: Task<A>): Task<[A]>;
// this is the standard Monoidal mult https://github.com/gcanti/fp-ts/blob/78917aada5d30f177090141202a3dff7fcd0c77b/src/Monoidal.ts#L15
export function parallelT<A, B>(a: Task<A>, b: Task<B>): Task<[A, B]>;
export function parallelT<A, B, C>(a: Task<A>, b: Task<B>, c: Task<C>): Task<[A, B, C]>;
export function parallelT<L, A, B, C, D>(a: Task<A>, b: Task<B>, c: Task<C>, d: Task<D>): Task<[A, B, C, D]>;

export function parallelT<L, A>(...list: Task<A>[]): Task<A[]> {
  return sequenceTaskArray(list);
}
