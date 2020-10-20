import React from "react";

class CStores {
  private stores: { [key: string]: any } = {};
  exists(name: string) {
    return typeof this.stores[name] !== "undefined";
  }
  getStore(name: string) {
    return this.stores[name];
  }
  setStore(name: string, store: any) {
    if (!store) return console.warn("Returned Invalid store", store);
    this.stores[name] = store;
  }
}

class CActions {
  private actions: {
    [key: string]: {
      [key: string]: { callback: (...args: any) => any };
    };
  } = {};

  exists(name: string, store: string) {
    return this.actions[store]
      ? this.actions[store][name]
        ? true
        : false
      : false;
  }

  setAction(
    name: string,
    store: string,
    mutation: (store: any, value: any) => any
  ) {
    if (!this.actions[store]) this.actions[store] = {};
    if (!this.actions[store][name]) {
      this.actions[store][name] = { callback: mutation };
    }
    return true;
  }

  doAction(name: string, store: string, payload: any) {
    stores.setStore(
      store,
      this.actions[store][name].callback(stores.getStore(store), payload)
    );
  }
}

const stores = new CStores();
const actions = new CActions();

const subscribers: {
  store: string;
  setState: Function;
  before?: Function;
  after?: Function;
}[] = [];

export const createStore: (name: string, initialState: any) => boolean = (
  name,
  initialState
) => {
  if (stores.exists(name)) return false;
  stores.setStore(name, initialState);
  return true;
};

export const createAction: (
  name: string,
  store: string,
  callback: (store: any, value: any | null) => any | undefined | void
) => boolean = (name, store, callback) => {
  return actions.setAction(name, store, callback);
};

export const subscribe: any = (store: string) => {
  return function (Component: any) {
    return (...args: any) => {
      const [, setState] = React.useState();
      React.useEffect(() => {
        subscribers.push({
          store,
          setState,
        });
      });
      return <Component {...args} store={stores.getStore(store)} />;
    };
  };
};

const updateSubscribers: (store: string) => boolean = (store) => {
  try {
    subscribers.forEach((subscriber) => {
      if (subscriber.store === store) {
        subscriber.setState(Math.random());
      }
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const dispatch: (
  name: string,
  store: string,
  payload: any
) => boolean = (name, store, payload) => {
  actions.doAction(name, store, payload);
  return updateSubscribers(store) || true;
};
