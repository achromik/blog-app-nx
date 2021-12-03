import {
  UserOutlined,
  UnorderedListOutlined,
  ProfileOutlined,
} from '@ant-design/icons';

export const icons = { UserOutlined, UnorderedListOutlined, ProfileOutlined };

export interface MenuItem {
  path: string;
  name: string;
  icon: keyof typeof icons;
}

export const menu: MenuItem[] = [
  { path: 'me', name: 'Profile', icon: 'ProfileOutlined' },
  { path: 'users', name: 'Users', icon: 'UnorderedListOutlined' },
];
