import { RegistrationRequestPayload } from '@libs/types';
import { getEmailRegexPattern } from '@libs/utils';

import { Form, Input, Button, FormInstance } from 'antd';

import styles from './registrationForm.module.scss';

interface RegistrationFormProps {
  onFinish: (values: RegistrationRequestPayload) => void;
  form: FormInstance<RegistrationRequestPayload>;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onFinish,
  form
}) => (
  <Form
    layout="vertical"
    form={form}
    name="register"
    scrollToFirstError
    onFinish={onFinish}
  >
    <Form.Item name="firstName" label="First Name">
      <Input />
    </Form.Item>
    <Form.Item name="lastName" label="Last Name">
      <Input />
    </Form.Item>
    <Form.Item
      name="email"
      label="E-mail"
      rules={[
        {
          type: 'email',
          message: 'The input is not valid E-mail!'
        },
        {
          required: true,
          message: 'Please input your E-mail!'
        }
      ]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="password"
      label="Password"
      rules={[
        {
          required: true,
          message: 'Please input your password!'
        },
        {
          pattern: getEmailRegexPattern(),
          message:
            'Password should be at least 8 characters long including 1 uppercase letter, 1 special character, alphanumeric characters'
        }
      ]}
      hasFeedback
    >
      <Input.Password />
    </Form.Item>
    <Form.Item
      name="confirmPassword"
      label="Confirm Password"
      dependencies={['password']}
      hasFeedback
      rules={[
        {
          required: true,
          message: 'Please confirm your password!'
        },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(
              new Error('The two passwords that you entered do not match!')
            );
          }
        })
      ]}
    >
      <Input.Password />
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit" className={styles.button}>
        Sign up
      </Button>
    </Form.Item>
  </Form>
);
