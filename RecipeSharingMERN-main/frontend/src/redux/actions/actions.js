
// Define the action properly
export const setPage = (pageName, recipeId) => ({
    type: 'SET_PAGE',
    payload: { pageName, recipeId },
  });