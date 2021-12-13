import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Row, Col, Card, message, Typography } from 'antd';

import { LoginRequestPayload } from '@libs/types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logIn } from '../../store/auth/auth.actions';
import { clearAuthError } from '../../store/auth/auth.slice';
import { StoreNamespace } from '../../store/types';
import { AppRoutes } from '../../config';
import { LoginForm } from '../../components/LoginForm/LoginForm';

import styles from './Login.module.scss';

export const Login: React.FC = () => {
  const [form] = Form.useForm<LoginRequestPayload>();

  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { error } = useAppSelector((state) => state[StoreNamespace.AUTH]);

  useEffect(() => {
    if (error) {
      message.error({ content: error });
    }
  }, [error]);

  const onFinish = async (values: LoginRequestPayload) => {
    const resultAction = await dispatch(logIn(values));

    if (logIn.fulfilled.match(resultAction)) {
      navigate(state?.from?.pathname ?? AppRoutes.dashboardRoute.index);
    }
  };

  const onChange = () => {
    dispatch(clearAuthError());
  };

  const goToRegistrationPage = (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(clearAuthError());
    navigate(AppRoutes.registration);
  };

  return (
    <Row className={styles.row} justify="center" align="middle">
      <Col md={6}>
        <Card title="Sign In">
          <LoginForm onFinish={onFinish} form={form} onChange={onChange} />
          <Row justify="space-between">
            <Typography.Text>
              Or{' '}
              <Link to={AppRoutes.registration} onClick={goToRegistrationPage}>
                sign up
              </Link>{' '}
              now!
            </Typography.Text>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};
