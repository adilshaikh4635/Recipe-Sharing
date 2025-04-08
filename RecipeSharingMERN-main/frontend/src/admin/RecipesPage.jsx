import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Input, Form, message, Select, Pagination } from 'antd';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [cookies, _] = useCookies(["access_token"]);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [recipesPerPage] = useState(3); // Number of recipes per page
  const { Meta } = Card;

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/recipes');
      console.log("API Response:", response.data); // Debugging
  
      // Extract the array of recipes
      const data = response.data.recipesWithUserDetails || [];  
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/recipes/${id}`);
      message.success('Recipe deleted successfully');
      fetchRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      message.error('Failed to delete recipe');
    }
  };

  const confirmDelete = (recipeId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this recipe?',
      onOk: () => deleteRecipe(recipeId)
    });
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
  };

  const handleUpdate = async (values) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/recipes/admin/${editingRecipe._id}`,
        values,
        {
          headers: { authorization: cookies.access_token }
        }
      );
      setRecipes(recipes.map(recipe => (recipe._id === editingRecipe._id ? response.data : recipe)));
      setEditingRecipe(null);
      message.success('Recipe updated successfully');
    } catch (err) {
      console.error("Error updating recipe:", err);
      message.error('Failed to update recipe');
    }
  };

  // Pagination: Get current page's recipes
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: '20px' }}>
      {recipes.length === 0 && <p>No recipes found.</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {currentRecipes.map((recipe, index) => (
          <Card
            key={recipe._id || index}
            style={{ width: '300px' }}
            cover={<img alt="recipe" src={recipe.imgurl} style={{ height: '200px', objectFit: 'cover' }} />}
            actions={[
              <Button onClick={() => handleEdit(recipe)}>Edit</Button>,
              <Button onClick={() => confirmDelete(recipe._id)} danger>Delete</Button>
            ]}
          >
            <Meta title={recipe.title} />
            <p><strong>Prep Time:</strong> {recipe.prepTime} minutes</p>
            <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
            <p><strong>Category:</strong> {recipe.category}</p>
          </Card>
        ))}
      </div>

      {editingRecipe && (
        <Modal
          title="Edit Recipe"
          open={!!editingRecipe}
          onCancel={() => setEditingRecipe(null)}
          footer={null}
        >
          <Form
            initialValues={editingRecipe}
            onFinish={handleUpdate}
            layout='vertical'
            style={{ width: '100%' }}
          >
            <Form.Item label="Recipe Name" name="title" rules={[{ required: true, message: "Please enter recipe name" }]}>
              <Input size='large' />
            </Form.Item>

            <Form.Item label="Ingredients" name="ingredients" tooltip='Enter comma-separated names' rules={[{ required: true, message: "Please enter ingredients" }]}>
              <Input.TextArea rows={2} />
            </Form.Item>

            <Form.Item label="Instructions" name="instructions" rules={[{ required: true, message: "Please enter recipe instructions" }]}>
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item label="Image URL" name="imgurl" rules={[{ required: true, message: "Please enter an image URL" }, { type: 'url', message: "Please enter a valid URL" }]}>
              <Input size='large' />
            </Form.Item>

            <Form.Item label="Prep Time (minutes)" name="prepTime" rules={[{ required: true, message: "Please enter preparation time" }]}>
              <Input type='number' size='large' />
            </Form.Item>

            <Form.Item label="Difficulty" name="difficulty" rules={[{ required: true, message: "Please select difficulty level" }]}>
              <Select options={[{ label: 'Easy', value: 'Easy' }, { label: 'Medium', value: 'Medium' }, { label: 'Hard', value: 'Hard' }]} />
            </Form.Item>

            <Form.Item label="Category" name="category" rules={[{ required: true, message: "Please select a category" }]}>
              <Select options={[{ label: 'Main course', value: 'main course' }, { label: 'Dessert', value: 'dessert' }, { label: 'Snacks', value: 'snacks' }, { label: 'Fastfood', value: 'fastfood' }]} />
            </Form.Item>

            <Form.Item>
              <Button htmlType='submit' type='primary'>Save</Button>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* Pagination */}
      <Pagination
        current={currentPage}
        pageSize={recipesPerPage}
        total={recipes.length}
        onChange={handlePageChange}
        showSizeChanger={false}
      />
    </div>
  );
};

export default RecipesPage;
