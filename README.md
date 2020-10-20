# whirl

### Installation

```bash
yarn add krystian-mw/whirl
# or
npm i krystian-mw/whirl
```

### Basic Usage

#### Function Component

```tsx
import React from "react";

import { enlist } from "whirl";

interface GraphData {
  xAxis?: string[];
}

const initialStore: GraphData = {};

const Graph = ({ store }: { store: GraphData }) => {
  return <LineGraph xAxis={store.xAxis} />;
};

export default enlist(Graph, {
  storeName: "GRAPH",
  actions: [],
  initialStore,
  subscribe: [],
});
```

#### Class Component

```tsx
import React from "react";

import { createStore, subscribe, dispatch, createAction } from "whirl";

const ref = React.createRef();

// Subscribe is essential to ensure it refreshes
@subscribe("TODO_LIST")
class App extends React.Component {
  componentDidMount() {
    createStore("TODO_LIST", {
      list: [],
    });

    createAction("ADD_TODO", "TODO_LIST", (store, payload) => {
      store.list.push(payload);
      // you can directly mutate the store, but in most cases you
      // will wanr to return it
      // return store;
    });

    createAction("REMOVE_TODO", "TODO_LIST", (store, payload) => {
      return { list: store.list.filter((item: string) => item !== payload) };
    });
  }

  componentDidUpdate() {}

  render() {
    return (
      <ul>
        <input ref={ref} type="text" />
        <button
          onClick={() => {
            dispatch(
              "ADD_TODO",
              "TODO_LIST",
              ref.current ? ref.current.value : Math.random()
            );
            ref.current.value = "";
          }}
        >
          Add
        </button>
        {this.props.store &&
          this.props.store.list &&
          this.props.store.list.map((item) => (
            <li key={Math.random()}>
              {item}
              <button
                onClick={() => dispatch("REMOVE_TODO", "TODO_LIST", item)}
              ></button>
            </li>
          ))}
      </ul>
    );
  }
}

export default App;
```
