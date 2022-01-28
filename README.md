# How to build custom React hooks

In this article I'm showing how to add a simple transition animation to React route page changes.

Technologies used:

- React with TypeScript

## Initial setup and configuration

1. Create a new React app with `npx create-react-app . --template typescript`
2. Start dev server using `npm start`

## Introduction to Hooks

In short, the hooks are plain functions you can use inside your functional React components.

A few rules apply, the hooks:

- should follow naming convension (for example useMyCustomHook)
- they can take attributes, as any normal function
- they return a value (string, number, object, array, anything really...)
- they can use other hooks internally, for example to keep track of state
- they should be only used on the root level of the component, never inside a loop or a conditional block

Lets say you have a component like this:

```jsx
import { useData } from "./hooks/data.ts";

export const Component = () => {
  // our custom hook, that return some data from the server
  const data = useData();

  // if we don't data yet, show loading
  if (!data) {
    return <div>Still loading...</div>;
  }

  // once we got our data, continue rendering our component
  return <div>Hello world</div>;
};
```

and our hook could be like this:

```typescript
export const useData = () => {
    // define internal state for our hook, default to undefined value
    const [data, toggleData] = useState(undefined);

    useEffect(() => {
        // when the hook is initialised (called for the first time from your component)
        // we fetch some data from the server and store it to the internal state
        const fetchData = async() => {
            const response = await fetch(...);
            toggleData(response.data);
        }
    }, []);

    // return our internal data to your component
    return data;
}
```

In this small example, useData is called immediately when your `<Component/>` is rendered, but the data returned to the component is `undefined` because it might take a while to fetch the data from the server.

React keeps track of your hooks and monitors their return value. When the return value changes, React will automatically trigger re-render of your component. The effects could cascade and affect your performance a lot. Pay attention to your hooks and make sure they don't cause unnecessary renders.

Usually, the hooks can just some plain calculations or data retrieval, but they can be more complex too. You could create a hook to return a value from your browsers localStorage or even from DOM, but for these you usually need a polling mechanism like timeouts/intervals as the source of the value comes outside React scope.

For further reading, check [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html).

I built a small demo app with two custom hooks. The app itself is rather simple, it has:

- a custom hook to generate a random number every 10 seconds (`hooks/random.ts`)
- a custom hook that creates a timer to show the user how much time there is left until the next random number is generated.

## A random number generator hook

In `app.tsx` I'm first adding my first hook with:

```ts
const randomNumber = useRandom();
```

As said, hooks are basically functions, so they will be executed when the component is rendered. The first hook is rather simple, it uses `useState` hook to maintain the current random number in the memory. In the `useEffect` I'm creating an interval to generate a new random number every 10sec. The point here is, that every time a new number is generated, React will notice the change in the return value hence causing re-render of the parent Component.

```ts
import { useEffect, useState } from "react";

// generates a random number between 1000 and 9000
const rand = () => Math.floor(Math.random() * 9000 + 1000);

export const useRandom = () => {
  const [number, storeNumber] = useState(rand());

  useEffect(() => {
    // create an interval, that will randomise a new number every 10sec
    const interval = setInterval(() => storeNumber(rand()), 10000);
    return () => clearInterval(interval);
  }, []);

  // return current random number, causes re-render when the value changes
  return number;
};
```

## A timer hook

The second hook is is a bit more complicated as it takes props:

```ts
const randomNumber = useRandom();
const timer = useTimer(randomNumber);
```

and the `hooks/timer.ts` looks like this. It has a bit more logic as it use `randomNumber` prop to reset the counter.

Also, it demostrates use of `useCallback` hook, that creates a memorised function. The useEffect dependencies are compared on every invocation and without useCallback the `useEffect` would be run after every second change.

```ts
import { useCallback, useEffect, useState } from "react";

export const useTimer = (randomNumber: number) => {
  const [seconds, storeSeconds] = useState(10);

  // a function to reduce seconds from counter, uses useCallback to improve performance
  const tick = useCallback(function () {
    storeSeconds((s) => s - 1);
  }, []);

  useEffect(() => {
    // useEffect is called when the values in the dependencies array change (either randomNumber or tick)
    // therefore we want to reset the counter here
    storeSeconds(10);

    // create an interval to count seconds
    const interval = setInterval(tick, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [randomNumber, tick]);

  // return seconds to next random number
  return seconds;
};
```

## Summary

The hooks are a very nice way to split functionality and make your application more modular. The only caveats are usually performance related as it is easy to create hooks that cause re-render too often.

Most of the issues can be avoided by using a [eslint plugin](https://reactjs.org/docs/hooks-rules.html#eslint-plugin) which is already included if you have created your app using `Create React App` cli.

On the other hand, you can also make too static hooks that do not cause re-render at all, if you use the hook to access values outside React scope.

**Feel free to browse the code, if you have any questions or improvement ideas let me know!**

## Author

Timo Kallela, for more information please visit my [GitHub profile](https://github.com/kallelat)

You can also contact me by [email](mailto:timo.kallela@gmail.com) or via [LinkedIn](https://www.linkedin.com/in/kallelat/)!

## License

Contents of this repository is licensed under [MIT](LICENSE) license.
