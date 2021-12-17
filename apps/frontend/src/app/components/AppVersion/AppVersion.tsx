import { InfoCircleTwoTone } from '@ant-design/icons';
import { Popover, Typography } from 'antd';

export const AppVersion: React.FC = () => {
  const content = (
    <Typography.Text>
      Version: {process.env.NX_REACT_APP_VERSION}
    </Typography.Text>
  );

  return (
    <div style={{ position: 'absolute', bottom: 0 }}>
      <Popover placement="right" content={content} trigger="hover">
        <InfoCircleTwoTone style={{ fontSize: 30, margin: 10 }} />
      </Popover>
    </div>
  );
};
