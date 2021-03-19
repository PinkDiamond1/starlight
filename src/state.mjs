/**
keeps track of the parser's state
*/

export const inits = {
  assignment: false,
};

export const node = { src: '', standardFunctions: '' };
export const zokrates = { src: '', standardFunctions: '', mainParams: '' };
export const solidity = { src: '', standardFunctions: '' };

export const currentFunction = { name: undefined };
export const blockCount = { value: 0 };

export const scope = {
  nestCount: 0,
  parentScope: null,
  scopeType: 'SourceUnit',
};

export const globals = {};
