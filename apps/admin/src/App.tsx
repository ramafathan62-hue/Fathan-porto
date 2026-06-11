import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Experience from './pages/Experience';
import Certifications from './pages/Certifications';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="experience" element={<Experience />} />
        <Route path="certifications" element={<Certifications />} />
      </Route>
    </Routes>
  );
}

export default App;
