import React from "react";
class CStores {
    constructor() {
        this.stores = {};
    }
    exists(name) {
        return typeof this.stores[name] !== "undefined";
    }
    getStore(name) {
        return this.stores[name];
    }
    setStore(name, store) {
        if (!store)
            return console.warn("Returned Invalid store", store);
        this.stores[name] = store;
    }
}
class CActions {
    constructor() {
        this.actions = {};
    }
    exists(name, store) {
        return this.actions[store]
            ? this.actions[store][name]
                ? true
                : false
            : false;
    }
    setAction(name, store, mutation) {
        if (!this.actions[store])
            this.actions[store] = {};
        if (!this.actions[store][name]) {
            this.actions[store][name] = { callback: mutation };
        }
        return true;
    }
    doAction(name, store, payload) {
        stores.setStore(store, this.actions[store][name].callback(stores.getStore(store), payload));
    }
}
const stores = new CStores();
const actions = new CActions();
const subscribers = [];
export const createStore = (name, initialState) => {
    if (stores.exists(name))
        return false;
    stores.setStore(name, initialState);
    return true;
};
export const createAction = (name, store, callback) => {
    return actions.setAction(name, store, callback);
};
export const subscribe = (store) => {
    return function (Component) {
        return (...args) => {
            const [, setState] = React.useState();
            React.useEffect(() => {
                subscribers.push({
                    store,
                    setState,
                });
            });
            return React.createElement(Component, Object.assign({}, args, { store: stores.getStore(store) }));
        };
    };
};
const updateSubscribers = (store) => {
    try {
        subscribers.forEach((subscriber) => {
            if (subscriber.store === store) {
                subscriber.setState(Math.random());
            }
        });
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
};
export const dispatch = (name, store, payload) => {
    actions.doAction(name, store, payload);
    return updateSubscribers(store) || true;
};
//# sourceMappingURL=index.js.map