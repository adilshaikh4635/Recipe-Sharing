import React from 'react';
import { useSelector } from 'react-redux';
import { Allrecipe } from './Recipe/Allrecipe';
import RecipeDisplay from './Recipe/RecipeDisplay.jsx';
import { Createrecipe } from './Recipe/Createrecipe';
import { Savedrecepe } from './Recipe/Savedrecepe';
import { Userprofile } from './profile/Userprofile';
import MyRecipeSection from './Recipe/MyRecipeSection';

export const ContentScreen = () => {
  const currentPage = useSelector((state) => state.page.currentPage);
  const selectedRecipeId =useSelector((state) => state.page.selectedRecipeId); // Get the selected recipe ID from the Redux store
  const userId = localStorage.getItem('userId'); // Get the current user ID from local storage

  return (
    <div className="content-box" style={{overflow: 'auto',
                                      height: 'calc(100vh - 60px - 45px)', /* Adjust height to fit header and footer */
                                      padding: '4px',
                                      overflowX:'hidden',
                                      background: 'rgb(249 251 255)',
                                      borderRadius: '10px'
                                      }}>
        {currentPage === 'Home' &&  <Allrecipe/>}
        {currentPage === 'Recipe Display' && <RecipeDisplay recipeId={selectedRecipeId} userId={userId} />} {/* Pass the selected recipe ID and user ID to RecipeDisplay */}
        {currentPage === 'Profile' && <Userprofile/>}
        {currentPage === 'Create Recipe' && <Createrecipe/>}
        {currentPage === 'Saved Recipes' && <Savedrecepe/>}
        {currentPage === 'My Recipes' && <MyRecipeSection/>}
    </div>
  );
};


