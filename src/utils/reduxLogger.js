import {createLogger} from "redux-logger";

export const logger = createLogger({
  // Optional configuration
  collapsed: true, // Collapse logs by default
  duration: true, // Show action duration
  timestamp: true, // Show timestamps
  // Filter out certain actions from logging (optional)
  predicate: (getState, action) => !action.type.includes("someActionToIgnore")
});
