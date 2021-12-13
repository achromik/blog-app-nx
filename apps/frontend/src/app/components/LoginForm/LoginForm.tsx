import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, FormInstance, Input } from 'antd';

import { LoginRequestPayload } from '@libs/types';

import styles from './loginForm.module.scss';

interface LoginFormProps {
  onFinish: (values: LoginRequestPayload) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  form: FormInstance<LoginRequestPayload>;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onFinish,
  onChange,
  form
}) => (
  <Form className="login-form" onFinish={onFinish} form={form}>
    <Form.Item
      name="email"
      rules={[{ required: true, message: 'Please input your Email!' }]}
    >
      <Input
        prefix={<UserOutlined className="site-form-item-icon" />}
        placeholder="Email"
        onChange={onChange}
      />
    </Form.Item>
    <Form.Item
      name="password"
      rules={[{ required: true, message: 'Please input your Password!' }]}
    >
      <Input
        type="password"
        prefix={<LockOutlined className="site-form-item-icon" />}
        placeholder="Password"
        onChange={onChange}
      />
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit" className={styles.button}>
        Log in
      </Button>
    </Form.Item>
  </Form>
);
