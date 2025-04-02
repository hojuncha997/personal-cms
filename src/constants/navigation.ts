export interface NavMenuItem {
  id: string;
  label: string;
  path: string;
}

export const NavMenuContent: NavMenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/'
  },
  {
    id: 'about',
    label: 'About',
    path: '/about'
  },
  {
    id: 'posts',
    label: 'Posts',
    path: '/posts'
  },
  {
    id: 'projects',
    label: 'Projects',
    path: '/projects'
  },
  {
    id: 'guestbooks',
    label: 'Guestbooks',
    path: '/guestbooks'
  }
] 