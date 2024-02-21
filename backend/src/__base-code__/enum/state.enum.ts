export enum State {
  DEPLOYED = 'deployed',
  ACTIVE = 'active',
  FULFILLED = 'fulfilled',
  PRODUCT_USED = 'product-used',
  EXECUTED = 'executed',
}

export const stateCode = {
  0: State.DEPLOYED,
  1: State.ACTIVE,
  2: State.FULFILLED,
  3: State.PRODUCT_USED,
  4: State.EXECUTED,
};
