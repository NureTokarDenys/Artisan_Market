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
import { PopupProvider } from './helpers/PopUpProvider';
import ProtectedRoute from './helpers/ProtectedRoute';
import { AuthProvider } from './helpers/AuthContext';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  // Temp
  const languageDir = [{name: "en"}, {name: "ua"}];
  const currencyDir = [{name: "Dollar", symbol: "$", multiply: 1}, {name: "Euro", symbol: "€", multiply: 1.1},{name: "Hryvnia", symbol: "₴", multiply: "40"}];

  const [profile, setProfile] = useState({
    bio: "",
    location: "",
    phone: "",
    email: "",
    currency: "",
    language: "",
    cardNumber: "",
    cardDate: "",
    cardCVV: "",
    cardName: "",
    profileImage: ""
  });

  // Profile Image
  const [profileImage, setProfileImage] = useState(null);

  // Load products
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
  
    const getProducts = async () => {
      try {
        const prod = await axios.get('/api/products');
        if (isMounted) {
          setProducts(prod.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    getProducts();
  
    return () => {
      isMounted = false;
    };
  }, []);


  return (
    <AuthProvider>
      <div className="App">
        <PopupProvider>
          <Header />
            <Routes>
              <Route path="/" element={<Navigate to="/products" replace />} />
              
              <Route path="/products" element={<Shop products={products} />} />
              <Route path="/products/:id" element={<Product products={products} />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile
                      profile={profile}
                      setProfile={setProfile}
                      currencies={currencyDir}
                      languages={languageDir}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          <Footer />
      </PopupProvider>
    </div>
  </AuthProvider>
  );
}

export default App;
