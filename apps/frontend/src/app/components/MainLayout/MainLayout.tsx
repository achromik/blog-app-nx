import { Layout, Menu } from 'antd';
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';

import styles from './main-layout.module.scss';
import { Link } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  title: string;
}

const { Header, Content, Footer, Sider } = Layout;

export const MainLayout: React.FC<Props> = ({ children, title }) => (
  <Layout>
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0
      }}
    >
      <div className={styles.logo} />
      <Menu theme="dark" mode="inline">
        {/* <Menu.Item key="1" icon={<UserOutlined />}>
          <Link to="/login">Test</Link>
        </Menu.Item> */}
        <Menu.Item key="2" icon={<VideoCameraOutlined />}>
          <Link to="test">Test</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<UploadOutlined />}>
          <Link to="me">Me</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<BarChartOutlined />}>
          nav 4
        </Menu.Item>
        <Menu.Item key="5" icon={<CloudOutlined />}>
          nav 5
        </Menu.Item>
        <Menu.Item key="6" icon={<AppstoreOutlined />}>
          nav 6
        </Menu.Item>
        <Menu.Item key="7" icon={<TeamOutlined />}>
          nav 7
        </Menu.Item>
        <Menu.Item key="8" icon={<ShopOutlined />}>
          nav 8
        </Menu.Item>
      </Menu>
    </Sider>
    <Layout className={styles['site-layout']} style={{ marginLeft: 200 }}>
      <Header
        // className={styles['site-layout-background']}
        style={{ padding: 0 }}
      >
        {title}
      </Header>
      <Content
        style={{
          margin: '24px 16px 0',
          overflow: 'initial',
          minHeight: 'calc(100vh - 158px)'
        }}
      >
        <div
          className={styles['site-layout-background']}
          style={{ padding: 24, textAlign: 'center' }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  </Layout>
);
