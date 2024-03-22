export function createHooks(callback) {
  let states = [];
  let memoizedValues = [];
  let callsCount = 0;

  const useState = (initState) => {
    const callIndex = callsCount;
    callsCount++;

    if (states[callIndex] === undefined) {
      states[callIndex] = initState;
    }

    const setState = (newValue) => {
      if (newValue === states[callIndex]) return;

      states[callIndex] = newValue;
      callback();
    };

    return [states[callIndex], setState];
  };

  const useMemo = (fn, deps) => {
    const callIndex = callsCount;
    callsCount++;

    if (memoizedValues[callIndex] === undefined) {
      memoizedValues[callIndex] = { deps, value: fn() };
    } else {
      const hasChangedDeps = deps.some(
        (dep, i) => memoizedValues[callIndex].deps[i] !== dep
      );
      if (hasChangedDeps) {
        memoizedValues[callIndex] = { deps, value: fn() };
      }
    }

    return memoizedValues[callIndex].value;
  };

  const resetContext = () => {
    callsCount = 0;
  };

  return { useState, useMemo, resetContext };
}
