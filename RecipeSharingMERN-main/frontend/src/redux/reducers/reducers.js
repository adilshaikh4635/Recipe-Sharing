import { createReducer } from '@reduxjs/toolkit';
import { setPage } from '../actions/actions';

const initialState = {
  currentPage: 'Home',
  selectedRecipeId: null,
};

const pageReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PAGE':
      return {
        ...state,
        currentPage: action.payload.pageName,
        selectedRecipeId: action.payload.recipeId,
      };
    default:
      return state;
  }
};

export default pageReducer;
