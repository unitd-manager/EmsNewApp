// import {legacy_createStore as createStore, applyMiddleware} from 'redux';
// import thunk from 'redux-thunk';
// import rootReducer from '../reducer';

// const store = createStore(rootReducer, applyMiddleware(thunk));

// export default store;


// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
