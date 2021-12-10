import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Row, Col, Card, Alert, notification } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { logIn } from '../../store/auth/auth.actions';
import { clearAuthError } from '../../store/auth/auth.slice';

import styles from './Login.module.scss';

export const Login: React.FC = () => {
  const [user, setUser] = useState({ email: '', password: '' });

  const error = useAppSelector((state) => state.auth.error);

  const openNotification = () => {
    notification.open({
      message: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      className: 'custom-class',
      style: {
        width: 600
      }
    });
  };

  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onFinish = async () => {
    const { email, password } = user;
    const resultAction = await dispatch(logIn({ email, password }));

    if (logIn.fulfilled.match(resultAction)) {
      navigate(state?.from?.pathname ?? '/dashboard');
    }
    // openNotification();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    error && dispatch(clearAuthError());
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Row className={styles.row} justify="center" align="middle">
      <Col md={6}>
        <Card title="Sign In">
          <Form name="normal_login" className="login-form" onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
                name="email"
                value="user.email"
                onChange={onChange}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your Password!' }
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                name="password"
                placeholder="Password"
                value="user.password"
                onChange={onChange}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.button}
              >
                Log in
              </Button>
              <Row justify="space-between">
                <Col>
                  Or <Link to="/register">sign up</Link> now!
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Card>
        {error && (
          <Alert message="Error" description={error} type="error" showIcon />
        )}
      </Col>
    </Row>
  );
};
