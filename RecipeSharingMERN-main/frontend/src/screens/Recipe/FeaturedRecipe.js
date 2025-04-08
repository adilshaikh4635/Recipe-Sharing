import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import FeaturedRecipeCard from './FeaturedRecipeCard';
import { matchScreen } from 'antd/es/_util/responsiveObserver';

const FeaturedRecipe = () => {
  const [featRecipe, setFeatRecipe] = useState(null);
  const [username, setUsername] = useState("");
  const [cookies, _] = useCookies(["access_token", "userID"]);
  const userID = cookies.userID;
  console.log("userID from freaturd section", userID);

  useEffect(() => {
    const fetchFeaturedRecipe = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/recipes/feat/featured');
        
        if (response.data && response.data.featuredRecipe) {
          setFeatRecipe(response.data.featuredRecipe);
          setUsername(response.data.username || "Unknown");  // ✅ Use username from response
        } else {
          console.error("No featured recipe found");
        }
      } catch (error) {
        console.error('Error fetching featured recipe:', error);
      }
    };

    fetchFeaturedRecipe();
  }, []);

  return ( 
    <div style={{
      height: matchScreen,
      minWidth: '310px',
      // margin: '5px',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h2 style={{ textAlign: 'center' }}>Featured Recipe of the Day</h2>

      {featRecipe ? (
        <FeaturedRecipeCard 
          key={featRecipe._id}
          featRecipe={featRecipe}   
          currentUserId={userID}
          username={username}
        />
      ) : (
        <p>Loading featured recipe...</p>
      )}
    </div>
  );
};

export default FeaturedRecipe;
