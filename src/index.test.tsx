import React, { useEffect } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { useGlobalState } from './index';

let container: Element;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
});

test('Link changes the class when hovered', async () => {
  const Test1 = () => {
    const [value] = useGlobalState('Key1');
    return <>{value || 'undefined'}</>;
  };
  const Test2 = () => {
    const [value, setValue] = useGlobalState('Key1');
    useEffect(() => {
      setValue(300);
    }, []);
    return <>{value || 'undefined'}</>;
  };
  const Test3 = () => {
    const [value] = useGlobalState('Key1', 100);
    return <>{value || 'undefined'}</>;
  };
  act(() => {
    render(
      <>
        <Test1 />
        <Test2 />
        <Test3 />
      </>,
      container
    );
  });
  expect(container.childNodes).toMatchSnapshot();
});
