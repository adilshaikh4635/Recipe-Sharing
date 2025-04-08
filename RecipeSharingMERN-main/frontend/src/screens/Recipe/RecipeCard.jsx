import React from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button } from 'antd';

import { setPage } from '../../redux/actions/actions'; 
const { Meta } = Card;

export const RecipeCard = ({recipe}) => {
  const dispatch = useDispatch();
  let userID = window.localStorage.getItem('userID');
  const navigateToRecipeDisplay = () => {
  dispatch(setPage("Recipe Display", recipe._id));  // Send recipe ID
  
    
  };

  return (
    <Card
      hoverable
      key={recipe._id}
      style={{
        width: '300px',
        padding: '5px',
        margin: '10px',
        boxShadow: '2px 2px 16px gray',
      }}
      cover={
        <img 
          alt="FOOD"
          src={recipe.imgurl} 
          style={{ height: '200px', cursor: 'pointer' }} 
          onClick={navigateToRecipeDisplay} // Navigate on image click
        />
      }
    >
      <Meta title={recipe?.title.toUpperCase()} />
      <p>Difficulty Level: {recipe?.difficulty.toUpperCase()}</p>
      <Button onClick={navigateToRecipeDisplay}>View Recipe</Button>  {/* Navigate on button click */}
    </Card>
  );
};