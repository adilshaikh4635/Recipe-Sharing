import React, { useState } from 'react';
import { Layout, Menu, notification, theme } from 'antd';
import { UserOutlined, FileTextOutlined, LogoutOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setPage } from '../redux/actions/actions';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import UsersPage from './UsersPage';
import RecipesPage from './RecipesPage';

const { Header, Content, Footer, Sider } = Layout;

// Navigation Items
const navbarItems = ['Users', 'Recipes', 'Logout'];
const icons = [UserOutlined, FileTextOutlined, LogoutOutlined];

const items = icons.map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `${navbarItems[index]}`,
}));

const AdminDashboard = () => {
  const [cookie, setCookie, removeCookie] = useCookies(['access_token']);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState('Users'); // State to track the current page

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handlePageChange = (key) => {
    if (key === '3') {
      // Logout case
      removeCookie('access_token');
      removeCookie('userID');
      notification.success({
        message: 'Logged out successfully',
        description: 'Redirecting to login...',
      });
      setTimeout(() => navigate('/login'), 1000);
    } else {
      // Set page based on menu selection
      const pageName = navbarItems[parseInt(key, 10) - 1];
      setCurrentPage(pageName); // Update the current page state
      dispatch(setPage(pageName));
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} onClick={(e) => handlePageChange(e.key)} />
      </Sider>
      
      <Layout>
        <Header 
          className='playfair-heading'
          style={{
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50px',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: "30px" }}>Admin Dashboard</h1>
        </Header>

        <Content style={{ margin: '16px' }}>
          <div style={{ background: colorBgContainer, borderRadius: borderRadiusLG, padding: 20 }}>
            {/* Page Content Rendering */}
            {currentPage === 'Users' && <UsersPage />}
            {currentPage === 'Recipes' && <RecipesPage />}
          </div>
        </Content>

        <Footer style={{ textAlign: 'center', padding: '10px' }}>
          Copyright © {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;