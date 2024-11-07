import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import appReducer from "./slices/app";

// slices
const rootPeristConfig = {
  key: "root",
  storage,
  keyprefix: "redux-",
  //   whitelist:[]
  //   blacklist:[]
};

const rootReducer = combineReducers({ app: appReducer });

export { rootPeristConfig, rootReducer };
