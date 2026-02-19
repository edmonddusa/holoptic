import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ flex: 1, overflowY: 'auto' }} data-scroll-container>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
