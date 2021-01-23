import { Dispatch, SetStateAction, useEffect, useState } from 'react';
type Render = Dispatch<SetStateAction<{}>>;
const renderMap = new Map<string, Set<Render>>();
const initialKyes = new Set<string>();
const cache: { [key: string]: unknown } = {};

export const useGlobalState = <T>(key: string, initialData?: T) => {
  const [, render] = useState<{} | null>(null);
  const dispatch = (data?: T | ((data: T) => T)) => {
    if (data === undefined) delete cache[key];
    else if (typeof data === 'function') {
      cache[key] = (data as (data: T) => T)(cache[key] as T);
    } else cache[key] = data;
    Array.from(renderMap.get(key) || []).forEach((render) => render({}));
  };
  useEffect(
    () => () => {
      renderMap.get(key)?.delete(render);
    },
    []
  );
  if (initialData !== undefined && !initialKyes.has(key)) {
    initialKyes.add(key);
    cache[key] = initialData;
  }
  if (renderMap.has(key)) {
    renderMap.get(key)?.add(render);
  } else {
    const e = new Set<Render>();
    e.add(render);
    renderMap.set(key, e);
  }
  return [cache[key] as undefined | T, dispatch] as const;
};

export const mutate = async <T = Object>(
  key?: string,
  data?: T | Promise<T> | ((data: T) => T | Promise<T>)
) => {
  if (key) {
    if (data !== undefined) {
      if (typeof data === 'function')
        cache[key] = await (data as (data: T) => T | Promise<T>)(cache[key] as T);
      else cache[key] = await data;
    }
    renderMap.get(key)?.forEach((render) => render({}));
  } else {
    renderMap.forEach((renders) => renders.forEach((render) => render({})));
  }
};
