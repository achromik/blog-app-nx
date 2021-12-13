import { Link, useNavigate } from 'react-router-dom';
import { Button, Layout, Menu } from 'antd';

import styles from './dashboardLayout.module.scss';
import { menu, icons } from '../../config/menu/dashboard.menu';
import { LogoutOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../../hooks';
import { logOut } from '../../store/auth/auth.slice';

const { Header, Content, Footer, Sider } = Layout;

interface Props {
  children: React.ReactNode;
  title: string;
}

export const DashboardLayout: React.FC<Props> = ({ children, title }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    navigate('/login');
    dispatch(logOut());
  };

  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.logo} />
        {title}
        <Button
          className={styles.logout}
          type="primary"
          shape="round"
          icon={<LogoutOutlined />}
          onClick={handleLogOut}
        >
          Logout
        </Button>
      </Header>
      <Layout className={styles.container}>
        <Sider className={styles.menu}>
          <Menu theme="dark" mode="inline">
            {menu.map((item) => {
              const Icon = icons[item.icon];
              return (
                <Menu.Item key={item.path} icon={<Icon type="user" />}>
                  <Link to={item.path}>{item.name}</Link>
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>
        <Layout className={styles.wrapper}>
          <Content className={styles.content}>
            <div className={styles.contentBackground}>{children}</div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            ©2021 Created by achromik with{' '}
            <span role="img" aria-label="Heart">
              ❤️
            </span>
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};
