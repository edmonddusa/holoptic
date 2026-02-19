import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { I18nProvider } from './context/I18nContext';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';

function PlausibleTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    if (window.plausible) {
      window.plausible('pageview');
    }
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <PlausibleTracker />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  );
}

export default App;
