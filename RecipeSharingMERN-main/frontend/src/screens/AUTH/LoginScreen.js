import React from 'react';
import { Button, Form, Input, notification } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Link from 'antd/es/typography/Link';

export const LoginScreen = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [cookies, setCookies] = useCookies(["access_token", "userID"]);

    const onFinish = async (values) => {
        const { email, password } = values;

        // Check if Admin Credentials
        if (email === "admin@gmail.com" && password === "Admin@123") {
            notification.success({
                message: 'Admin Login Successful',
                description: 'Welcome, Admin!',
            });

            // Set admin token (you can use a different token system for admin)
            setCookies("access_token", "admin_token", { path: "/", maxAge: 3600 });
            setCookies("userID", "admin", { path: "/", maxAge: 3600 });
console.log(cookies);
            return navigate("/admin/dashboard"); // Redirect to admin dashboard
        }

        try {
            const response = await axios.post('http://localhost:5000/api/users/login', values);

            if (response.status === 200) {
                notification.success({
                    message: 'Login Successful',
                    description: 'You have successfully logged in!',
                });

                const { token, _id } = response.data;

                // Set cookies with expiration time (1 hour)
                setCookies("access_token", token, { path: "/", maxAge: 3600 });
                setCookies("userID", _id, { path: "/", maxAge: 3600 });

                navigate("/"); // Redirect to home
            }
        } catch (error) {
            console.error("Login error:", error);
            notification.error({
                message: 'Login Error',
                description: 'Invalid email or password. Please try again.',
            });
        }
    };

    return (
        <div style={{ alignItems: 'center', display: 'flex', gap: '4rem', flexDirection: 'column', justifyContent: 'center', margin: "120px" }}>
            <div style={{ fontSize: '40px', textAlign: 'center', textDecoration: 'underline' }}>
                Login
            </div>
            <Form form={form} onFinish={onFinish} layout='vertical' style={{ width: '50%' }}>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            type: 'email',
                            message: 'Please Enter Valid Email!',
                        },
                    ]}
                >
                    <Input size='large' placeholder='Email id' />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password size='large' placeholder='Password' />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 10 }}>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>

                <div style={{ justifyContent: "space-between", display: "flex" }}>
                    <Link href="/register">
                        {"Don't have an account? Sign Up"}
                    </Link>
                </div>
            </Form>
            <div>Copyright © {new Date().getFullYear()}</div>
        </div>
    );
};
