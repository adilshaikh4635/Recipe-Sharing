import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Card, Image, Button, Typography, Spin } from 'antd';
import CommentSection from './CommentSection';

const { Title, Paragraph } = Typography;

const RatingComponent = ({ userRating, onRatingChange }) => (
  <div>
    <b>Your Rating</b>
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ cursor: 'pointer', color: star <= userRating ? 'gold' : 'gray', fontSize: '24px' }}
          onClick={() => onRatingChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  </div>
);

const AverageRatingComponent = ({ averageRating, numberOfRatings }) => {
  const renderStars = () => {
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <span key={index} style={{ color: 'gold', fontSize: '24px' }}>★</span>
        ))}
        {halfStar && <span style={{ color: 'gold', fontSize: '24px' }}>☆</span>}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={index} style={{ color: 'gray', fontSize: '24px' }}>★</span>
        ))}
      </>
    );
  };

  return (
    <div>
      <b>Average Rating</b>
      <div>{renderStars()}</div>
      <p>({numberOfRatings} ratings)</p>
    </div>
  );
};

const RecipeDisplay = ({ recipeId, userId }) => {
  const [cookies] = useCookies(['access_token', 'userID']);
  const currentuserId = userId || cookies.userID; // Use cookie if userId is not provided
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [averageRatingData, setAverageRatingData] = useState({ averageRating: 0, numberOfRatings: 0 });
  const [showComments, setShowComments] = useState(false);
  const [username, setUsername] = useState(""); // State to store the username
  const [saverecipe, setSaverecipe] = useState([]); // Added state for saved recipes

  useEffect(() => {
    if (!recipeId) {
      setError(true);
      setLoading(false);
      return;
    }

    const fetchRecipeDetails = async () => {
      try {
        // Fetch recipe details
        const response = await axios.get(`http://localhost:5000/api/recipes/${recipeId}`);
        setRecipe(response.data);

        // Fetch the username of the recipe creator
        const userResponse = await axios.get(
          `http://localhost:5000/api/users/profile/${response.data.userid}`,
          { headers: { authorization: cookies.access_token } }
        );
        setUsername(userResponse.data.username || "Unknown"); // Set the username

        // Check if the user has rated this recipe
        const existingRating = response.data.ratings?.find((r) => r.userid === currentuserId);
        if (existingRating) {
          setUserRating(existingRating.rating);
        }

        // Fetch overall recipe rating
        const ratingResponse = await axios.get(`http://localhost:5000/api/recipes/${recipeId}/rate`);
        setAverageRatingData(ratingResponse.data);

      } catch (error) {
        console.error('Error fetching recipe details:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    // Fetch saved recipes
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/recipes/savedrecipes/ids/${currentuserId}`,
          { headers: { authorization: cookies.access_token } }
        );
        setSaverecipe(response.data.savedRecipes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecipeDetails();
    fetchSavedRecipes();
  }, [recipeId, currentuserId, cookies.access_token]);

  const handleRatingChange = async (newRating) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/recipes/${recipe._id}/rate`,
        { userid: currentuserId, rating: newRating },
        { headers: { authorization: cookies.access_token } }
      );
      setUserRating(newRating);
      setAverageRatingData(response.data);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const savedItem = async (recipeID) => {
    const values = { recipeID, userID: currentuserId };
    try {
      const response = await axios.put("http://localhost:5000/api/recipes", values, {
        headers: { authorization: cookies.access_token }
      });
      setSaverecipe(response.data.savedRecipes);
    } catch (error) {
      console.log("Server issue", error);
    }
  };

  const isRecipeSaved = (id) => saverecipe?.includes(id);

  if (loading) return <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: '20px' }} />;
  if (error || !recipe) return <p style={{ textAlign: 'center', color: 'red' }}>Recipe not found.</p>;

  return (
    <div className="recipe-display-container" style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <Card style={{ maxWidth: 800, width: '100%', padding: '20px' }}>
        <Image
          src={recipe.imgurl || 'https://via.placeholder.com/800'}
          alt={recipe.title}
          style={{ width: '720px', height: '500px', borderRadius: '10px' }}
          preview={false}
        />
        <Title level={2}>{recipe.title}</Title>
        <Paragraph><strong>Category:</strong> {recipe.category}</Paragraph>
        <Paragraph><strong>Difficulty:</strong> {recipe.difficulty}</Paragraph>

        <RatingComponent userRating={userRating} onRatingChange={handleRatingChange} />

        <p>Created By: {username}</p>

        <AverageRatingComponent
          averageRating={averageRatingData.averageRating}
          numberOfRatings={averageRatingData.numberOfRatings}
        />

        <Button onClick={() => savedItem(recipe._id)} disabled={isRecipeSaved(recipe._id)}>
          {isRecipeSaved(recipe._id) ? 'Saved Recipe' : 'Save Recipe'}
        </Button>

        <Paragraph><strong>Ingredients:</strong></Paragraph>
        {recipe.ingredients?.length ? (
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        ) : <Paragraph>No ingredients listed.</Paragraph>}

        <Paragraph><strong>Instructions:</strong></Paragraph>
        <Paragraph>{recipe.instructions || 'No instructions available.'}</Paragraph>

        <b style={{ display: 'block' }}>Comments</b>

        <Button onClick={() => setShowComments(!showComments)} style={{ marginBottom: '10px' }}>
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </Button>

        {showComments && <CommentSection recipeId={recipe._id} currentUserId={currentuserId} />}
      </Card>
    </div>
  );
};

export default RecipeDisplay;
