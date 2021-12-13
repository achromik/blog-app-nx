import { Button, Result, Row } from 'antd';

export const NotFound: React.FC = () => (
  <Row style={{ height: '100vh' }} justify="center" align="middle">
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button type="primary">Back Home</Button>}
    />
  </Row>
);
