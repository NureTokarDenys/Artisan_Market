import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Shop from './Shop';
import About from './About';
import Contact from './Contact';
import Profile from './Profile';
import Cart from './Cart';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
