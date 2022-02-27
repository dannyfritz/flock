type Id = number;
type Data = bigint;
type Mask = bigint;

export const idsToMask = (ids: Array<Id>): Mask => {
  let mask = 0n;
  for (const id of ids) {
    mask |= 1n << BigInt(id);
  }
  return mask;
}

export const all = (data: Data, mask: Mask): boolean => (data & mask) === mask;

export const any = (data: Data, mask: Mask): boolean => (data & mask) !== 0n;

export const without = (data: Data, mask: Mask): boolean => (data & mask) === 0n;
