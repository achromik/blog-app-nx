import {
  Card,
  Col,
  Row,
  Form,
  Input,
  Button,
  Spin,
  Result,
  Typography
} from 'antd';

import styles from './Register.module.scss';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { register } from '../../store/auth/auth.actions';
import { RegisterUserRequestPayload } from '@libs/types';
import { AsyncActionStatus, StoreNamespace } from '../../store/types';
import { clearAuthError, setIsRegistered } from '../../store/auth/auth.slice';
import { CloseCircleOutlined } from '@ant-design/icons';
import { ROUTES } from '../../config';
import { RegisterForm } from '../../components/RegisterForm/RegisterForm';

export const Register: React.FC = () => {
  const { error, isRegistered, status } = useAppSelector(
    (state) => state[StoreNamespace.AUTH]
  );

  const dispatch = useAppDispatch();

  const [form] = Form.useForm<RegisterUserRequestPayload>();

  const onFinish = (values: RegisterUserRequestPayload) => {
    dispatch(register(values));
  };

  return (
    <Row className={styles.row}>
      {!error && !isRegistered && (
        <Col md={8}>
          <Card title="Sign up">
            <Spin size="large" spinning={status === AsyncActionStatus.PENDING}>
              <RegisterForm onFinish={onFinish} form={form} />
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
              to={ROUTES.login}
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
