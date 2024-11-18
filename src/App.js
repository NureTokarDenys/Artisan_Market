import { Navigate, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Shop from './pages/Shop';
import Product from './pages/Product';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';
import './App.css';
import { useState } from 'react';

function App() {
  // Temp users
  const [products, setProducts] = useState([{
    name: "Ceramic bowl",
    price: 74.99,
    description: "This handcrafted ceramic bowl set is a perfect addition to your home. Each bowl is carefully crafted from natural clay and kilrr fired at high temperatures. giving it both durability and a unique appearance. Ideal for serving food. adding a decorative touch, or gifting to someone who appreciates original, handmade items,",
    quantity: 4,
    images: ["img1.png"]
  }]);

  // Temp
  const languageDir = [{name: "en"}, {name: "ua"}];
  const currencyDir = [{name: "Dollar", symbol: "$", multiply: 1}, {name: "Euro", symbol: "€", multiply: 1.1},{name: "Hryvnia", symbol: "₴", multiply: "40"}];

  // Profile States
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("");
  const [language, setLanguage] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardDate, setCardDate] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [cardName, setCardName] = useState("");

  // Profile Image
  const [profileImage, setProfileImage] = useState(null);

  return (
    <div className="App">
      <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            
            <Route path="/products" element={<Shop />} />
            <Route path="/products/:id" element={<Product />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile currencies={currencyDir} languages={languageDir} 
                                              bio={bio} setBio={setBio} 
                                              location={location} setLocation={setLocation}
                                              phone={phone} setPhone={setPhone}
                                              email={email} setEmail={setEmail}
                                              currency={currency} setCurrency={setCurrency}
                                              language={language} setLanguage={setLanguage}
                                              cardNumber={cardNumber} setCardNumber={setCardNumber}
                                              cardDate={cardDate} setCardDate={setCardDate}
                                              cardCVV={cardCVV} setCardCVV={setCardCVV}
                                              cardName={cardName} setCardName={setCardName}
                                              profileImage={profileImage} setProfileImage={setProfileImage}
                                            />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
    </div>
  );
}

export default App;
