import React from 'react';

type ProviderProps<TState> = React.PropsWithChildren<{
  value: TState | (() => TState);
}>;
type Dispatch<TState> = React.Dispatch<React.SetStateAction<TState>>;
type CreateAdvancedContextReturn<TState> = [
  () => TState,
  Dispatch<TState>,
  () => [TState, Dispatch<TState>],
  React.FC<ProviderProps<TState>>,
];

/**
 * Creates an advanced context with state and dispatch providers.
 *
 * @template TState - The type of the context state.
 * @param {string} [name='Advanced context'] - The name of the context.
 * @returns {CreateAdvancedContextReturn<TState>} - Tuple containing the useState, useDispatch, useContext and Provider.
 */
export const createAdvancedContext = <TState,>(
  name: string = 'Advanced context',
): CreateAdvancedContextReturn<TState> => {
  const contextState = React.createContext<TState | null>(null);
  const contextDispatch = React.createContext<Dispatch<TState> | null>(null);

  const Provider = (props: ProviderProps<TState>) => {
    const [state, setState] = React.useState<TState>(props.value);
    return (
      <contextDispatch.Provider value={setState}>
        <contextState.Provider value={state}>
          {props.children}
        </contextState.Provider>
      </contextDispatch.Provider>
    );
  };

  const useContext = (): [TState, Dispatch<TState>] => {
    const state = React.useContext(contextState);
    const dispatch = React.useContext(contextDispatch);
    if (state === null || dispatch === null)
      throw new Error(`useContext must be used within a ${name} Provider`);
    return [state, dispatch] as const;
  };

  const useState = (): TState => {
    const state = React.useContext(contextState);
    if (state === null)
      throw new Error(`useState must be used within a ${name} Provider`);
    return state;
  };

  const useDispatch = (): Dispatch<TState> => {
    const dispatch = React.useContext(contextDispatch);
    if (dispatch === null)
      throw new Error(`useDispatch must be used within a ${name} Provider`);
    return dispatch;
  };

  return [useState, useDispatch, useContext, Provider] as const;
};
