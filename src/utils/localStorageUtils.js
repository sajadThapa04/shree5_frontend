export const loadUserStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("userState");
    if (serializedState === null) {
      return undefined;
    }
    return {user: JSON.parse(serializedState)};
  } catch (err) {
    console.warn("Failed to load user state from localStorage", err);
    return undefined;
  }
};

export const saveUserStateToLocalStorage = userState => {
  try {
    const serializedState = JSON.stringify(userState);
    localStorage.setItem("userState", serializedState);
  } catch (err) {
    console.warn("Failed to save user state to localStorage", err);
  }
};
