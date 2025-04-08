import React from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button, Typography, Spin } from 'antd';
import { setPage } from '../../redux/actions/actions';

const { Title, Paragraph } = Typography;

const FeaturedRecipeCard = ({ featRecipe, currentUserId, username }) => {
  const dispatch = useDispatch();

  // Check if featRecipe is undefined or null
  if (!featRecipe) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Spin size="large" />
        <p>Loading featured recipe...</p>
      </div>
    );
  }

  const navigateToRecipeDisplay = () => {
    dispatch(setPage("Recipe Display", featRecipe._id)); // Send recipe ID
  };

  return (
    <Card
      hoverable
      key={featRecipe._id}
      style={{
        maxWidth: '500px',
        // padding: '10px',
        // margin: '20px auto',
        boxShadow: '3px 3px 12px gray',
        textAlign: 'center',
      }}
      cover={
        <img
          alt={featRecipe?.title || 'Featured Recipe'}
          src={featRecipe?.imgurl || 'https://via.placeholder.com/500'}
          style={{ width: '100%', height: '300px', objectFit: 'cover', cursor: 'pointer' }}
          onClick={navigateToRecipeDisplay}
        />
      }
    >
      <Title level={3}>{featRecipe?.title?.toUpperCase() || "Unknown Recipe"}</Title>
      <Paragraph><strong>Category:</strong> {featRecipe?.category || "N/A"}</Paragraph>
      <Paragraph><strong>Difficulty:</strong> {featRecipe?.difficulty?.toUpperCase() || "N/A"}</Paragraph>
      <Paragraph><strong>Created By:</strong> {username || "Unknown User"}</Paragraph>
      {/* <Button type="primary" onClick={navigateToRecipeDisplay} style={{ marginTop: '10px' }}>
        View Full Recipe
      </Button> */}
    </Card>
  );
};

export default FeaturedRecipeCard;
