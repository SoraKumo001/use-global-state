# @react-liblary/use-global-state

## What is this

Global `setState` that does not require `provider` or `store`

## usage

- `[data,dispatch] = useGlobalState(key,initData)`

```tsx
import { useGlobalState } from '@react-liblary/use-global-state';

interface Props {
  name: string;
}

export const Counter = ({ name }: Props) => {
  const [count, setCount] = useGlobalState<number>(name, 10);
  return (
    <div>
      <button onClick={() => setCount((count) => count - 1)}>-</button>
      <button onClick={() => setCount(count + 1)}>+</button>
      {count}
    </div>
  );
};
```

- `mutate(key,data)`

```tsx
import { mutate } from '@react-liblary/use-global-state';

interface Props {
  name: string;
}

export const InputBox = ({ name }: Props) => {
  return (
    <div>
      <input
        defaultValue="100"
        onKeyPress={(e) => {
          e.key === 'Enter' && mutate(name, Number(e.currentTarget.value));
        }}
      />
    </div>
  );
};
```

- `reset`

```tsx
import { reset } from '@react-liblary/use-global-state';

reset(); //Clear cache
```
