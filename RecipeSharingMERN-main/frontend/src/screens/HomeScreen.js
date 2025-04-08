import React, { useEffect } from 'react';
import { UploadOutlined, UserOutlined, HomeOutlined, SaveOutlined, LogoutOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Layout, Menu, notification, theme } from 'antd';
import { useDispatch } from 'react-redux';
import { setPage } from '../redux/actions/actions';
import { ContentScreen } from './ContentScreen';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import "./HomeScreen.css";


const { Header, Content, Footer, Sider } = Layout;

const navbaritem = ['Profile', 'Home', 'Create Recipe', 'Saved Recipes','My Recipes', 'Logout'];
const items = [UserOutlined, HomeOutlined, UploadOutlined, SaveOutlined,ArrowDownOutlined, LogoutOutlined].map(
  (icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `${navbaritem[index]}`,
  })
);

export const HomeScreen = () => {
  const [cookie, setCookie, removeCookie] = useCookies(['access_token']);
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const dispatch = useDispatch();
  const handlePageChange = (page, recipeId = null) => {
    if (page === '6') {
      removeCookie('access_token');
      removeCookie('userID');
      notification.success({
        message: 'Logged out successfully',
        description: 'We hope you will back soon',
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } else {
      const pageName = navbaritem[parseInt(page, 10) - 1];
      dispatch(setPage(pageName, recipeId));  // Pass recipeId to Redux
    }
  };
  

  return (
    <div >
      <Layout style={{ height: '100vh'}}>
        <Sider>
          <div className="demo-logo-vertical" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['2']} items={items} onClick={(e) => handlePageChange(e.key)} />
        </Sider>
        <Layout>
        <Header 
          className='playfair-heading'
          style={{
            background: colorBgContainer,
            display: 'flex',       /* Enables flexbox */
            justifyContent: 'center', /* Centers text horizontally */
            alignItems: 'center',  /* Centers text vertically */
            height: '50px',       /* Adjust height as needed */
            textAlign: 'center'    /* Ensures text remains centered */
          }}
        >
          <h1 style={{fontSize:"50px" }}> KitchenScrolls </h1>
        </Header>


          <Content
            style={{
              margin: '4px 5px 0'
            }}
          >
            <div
               style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              
                maxHeight: 'calc(100vh - 50px)',
              }}
            >
              <ContentScreen/>
            </div>
          </Content>
          <Footer
            style={{
              padding: '8px 10px',
              textAlign: 'center',
              lineHeight: '30px', // Center text vertically
            }}
          >
             Copyright ©{new Date().getFullYear()}
          </Footer>
        </Layout> 
      </Layout>
    </div>
  );
};

