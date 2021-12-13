import { Card, Col, Row, Form, Button, Spin, Result, Typography } from 'antd';

import styles from './registration.module.scss';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { register } from '../../store/auth/auth.actions';
import { RegistrationRequestPayload } from '@libs/types';
import { AsyncActionStatus, StoreNamespace } from '../../store/types';
import { clearAuthError, setIsRegistered } from '../../store/auth/auth.slice';
import { CloseCircleOutlined } from '@ant-design/icons';
import { AppRoutes } from '../../config';
import { RegistrationForm } from '../../components/RegistrationForm/RegistrationForm';

export const Registration: React.FC = () => {
  const { error, isRegistered, status } = useAppSelector(
    (state) => state[StoreNamespace.AUTH]
  );

  const dispatch = useAppDispatch();

  const [form] = Form.useForm<RegistrationRequestPayload>();

  const onFinish = (values: RegistrationRequestPayload) => {
    dispatch(register(values));
  };

  return (
    <Row className={styles.row}>
      {!error && !isRegistered && (
        <Col md={6}>
          <Card title="Sign up">
            <Spin size="large" spinning={status === AsyncActionStatus.PENDING}>
              <RegistrationForm onFinish={onFinish} form={form} />
            </Spin>
          </Card>
        </Col>
      )}
      {isRegistered && (
        <Result
          status="success"
          title="Successfully Registered!"
          subTitle="Check your email account and confirm your email address."
          extra={
            <Link
              to={AppRoutes.login}
              onClick={() => dispatch(setIsRegistered(false))}
            >
              <Button type="primary">Login</Button>
            </Link>
          }
        />
      )}
      {error && (
        <Result
          status="error"
          extra={
            <Button type="primary" onClick={() => dispatch(clearAuthError())}>
              Try Again
            </Button>
          }
        >
          <div className={styles.description}>
            <Typography.Paragraph>
              <Typography.Text strong>
                The content you submitted has the following error:
              </Typography.Text>
            </Typography.Paragraph>
            <Typography.Paragraph>
              <CloseCircleOutlined className={styles.errorIcon} /> {error}
            </Typography.Paragraph>
          </div>
        </Result>
      )}
    </Row>
  );
};
