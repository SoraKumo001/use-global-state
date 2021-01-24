import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
type Render<T = unknown> = Dispatch<SetStateAction<T | undefined>>;
const renderMap = new Map<string, Set<Render>>();
const initialKyes = new Set<string>();
const cache: { [key: string]: unknown } = {};

export const query = <T = unknown>(key: string) => cache[key] as T;

export const mutate = <T = Object>(
  key?: string,
  data?: T | Promise<T> | ((data: T) => T | Promise<T>)
) => {
  if (key) {
    if (data !== undefined) {
      const value =
        typeof data === 'function' ? (data as (data: T) => T | Promise<T>)(cache[key] as T) : data;
      if (value instanceof Promise) {
        value.then((data) => {
          cache[key] = data;
          renderMap.get(key)?.forEach((render) => setTimeout(() => render(data), 100));
          initialKyes.add(key);
        });
      } else {
        cache[key] = data;
        renderMap.get(key)?.forEach((render) => setTimeout(() => render(data), 100));
        initialKyes.add(key);
      }
    }
  } else {
    renderMap.forEach((renders) => renders.forEach((render) => render((value: unknown) => value)));
  }
};

export const useGlobalState = <T = unknown>(key: string, initialData?: T | (() => T)) => {
  type RenderMap = Map<string, Set<Render<T>>>;
  const [state, render] = useState<T | undefined>((cache[key] as T) || initialData);
  const dispatch = useCallback(
    (data?: T | ((data: T) => T)) => {
      mutate(key, data);
    },
    [key]
  );
  let init = false;
  useEffect(() => {
    init && renderMap.get(key)?.forEach((r) => r(cache[key]));
    return () => {
      (renderMap as RenderMap).get(key)?.delete(render);
    };
  }, []);
  if (initialData !== undefined && !initialKyes.has(key)) {
    cache[key] = typeof initialData === 'function' ? (initialData as () => T)() : initialData;
    initialKyes.add(key);
    init = true;
  }
  if (renderMap.has(key)) (renderMap as RenderMap).get(key)?.add(render);
  else (renderMap as RenderMap).set(key, new Set<Render<T>>().add(render));

  return [state, dispatch] as const;
};
