import React, { useEffect } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { reset, useGlobalState } from '../src/index';

let container: HTMLElement;
beforeEach(() => {
  reset();
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
});

it('initData undefined', () => {
  const Component01 = () => {
    const [value] = useGlobalState('Key1');
    return <div>{value}</div>;
  };
  const Component02 = () => {
    const [value] = useGlobalState('Key1');
    return <div>{value}</div>;
  };
  const Component03 = () => {
    const [value] = useGlobalState('Key1');
    return <div>{value}</div>;
  };

  act(() => {
    render(
      <>
        <Component01 />
        <Component02 />
        <Component03 />
      </>,
      container
    );
  });
  expect(container.childNodes).toMatchSnapshot();
});

it('initData', () => {
  const Component01 = () => {
    const [value] = useGlobalState('Key1');
    return <div>{value}</div>;
  };
  const Component02 = () => {
    //first initData
    const [value] = useGlobalState('Key1', 1);
    return <div>{value}</div>;
  };
  const Component03 = () => {
    const [value] = useGlobalState('Key1', 2);
    return <div>{value}</div>;
  };

  act(() => {
    render(
      <>
        <Component01 />
        <Component02 />
        <Component03 />
      </>,
      container
    );
  });
  expect(container.childNodes).toMatchSnapshot();
});

it('useEffect', () => {
  const Component01 = () => {
    const [value] = useGlobalState('Key1');
    return <div>{value}</div>;
  };
  const Component02 = () => {
    const [value, setValue] = useGlobalState('Key1', 1);
    useEffect(() => {
      setValue(3);
    }, []);
    return <div>{value}</div>;
  };
  const Component03 = () => {
    const [value, setValue] = useGlobalState('Key1', 2);
    useEffect(() => {
      //Last setValue
      setValue(4);
    }, []);
    return <>{value || 'undefined'}</>;
  };

  act(() => {
    render(
      <>
        <Component01 />
        <Component02 />
        <Component03 />
      </>,
      container
    );
  });
  expect(container.childNodes).toMatchSnapshot();
});

it('onclick', () => {
  const Component01 = () => {
    const [value, setValue] = useGlobalState('Key1');
    return (
      <button
        id="click"
        onClick={() => {
          setValue(4);
        }}
      >
        {value}
      </button>
    );
  };
  const Component02 = () => {
    const [value, setValue] = useGlobalState('Key1', 1);
    useEffect(() => {
      setValue(3);
    }, []);
    return <div>{value}</div>;
  };
  const Component03 = () => {
    const [value] = useGlobalState('Key1', 2);
    return <>{value || 'undefined'}</>;
  };

  act(() => {
    render(
      <>
        <Component01 />
        <Component02 />
        <Component03 />
      </>,
      container
    );
  });
  expect(container.childNodes).toMatchSnapshot();
  act(() => {
    const element = container.querySelector('#click');
    element?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(container.childNodes).toMatchSnapshot();
});