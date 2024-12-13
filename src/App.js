import { Navigate, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Shop from './pages/Shop';
import Product from './pages/Product';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';
import useAuth from './hooks/useAuth';
import ProtectedRoute from './helpers/ProtectedRoute';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader } from './components/Loader';
import useAxiosPrivate from './hooks/useAxiosPrivate';
import Catalog from './pages/Catalog';

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

function App() {
  const axiosPrivate = useAxiosPrivate();
  // Temp
  const languageDir = [{name: "en"}, {name: "ua"}];
  const currencyDir = [{name: "Dollar", symbol: "$", multiply: 1}, {name: "Euro", symbol: "€", multiply: 1.1},{name: "Hryvnia", symbol: "₴", multiply: "40"}];
  const sortOptions = [
    {
      name: "By relevancy",
      index: 0
    },
    {
      name: "By popularity", 
      index: 1
    },
    {
      name: "Highest price",
      index: 2
    },
    {
      name: "Lowest price",
      index: 3
    }
  ];

  const { auth, setAuth } = useAuth();

  const [loading, setLoading] = useState(true);

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
    profileImage: "", 
    isSet: false
  });

  const [sort, setSort] = useState(0);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Loading
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
  
    const fetchData = async () => {
      try {
        const authResponse = await axios.get('/api/auth/status', { withCredentials: true });
        if (authResponse.data.authenticated) {
          setAuth({
            isAuthenticated: true,
            userId: authResponse.data.userId,
            token: authResponse.data.accessToken,
          });
        } else {
          setAuth({ isAuthenticated: false, userId: null, token: null });
        }
  
        const productsResponse = await axios.get('/api/products', { signal: controller.signal });
        if (isMounted) setProducts(productsResponse.data);
  
        if (authResponse.data.authenticated) {
          const cartResponse = await axiosPrivate.get(`/api/cart/${authResponse.data.userId}`, {
            signal: controller.signal,
          });
          if (isMounted) setCart(cartResponse.data.cart || []);
  
          const wishlistResponse = await axiosPrivate.get(`/api/wishlist/${authResponse.data.userId}`, {
            signal: controller.signal,
          });
          if (isMounted) setWishlist(wishlistResponse.data.wishlist || []);
        }
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          console.error('Error fetching data:', error);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  

  const saveCartToBackend = async (updatedCart) => {
    try {
      await axiosPrivate.post('/api/cart/' + auth.userId, { cart: updatedCart });
      console.log('Cart saved successfully');
    } catch (error) {
      console.error('Failed to save cart:', error.message);
    }
  };

  const saveWishlistToBackend = async (updatedWishlist) => {
    try {
      await axiosPrivate.post('/api/wishlist/' + auth.userId , { wishlist: updatedWishlist });
      console.log('Wishlist saved successfully');
    } catch (error) {
      console.error('Failed to save wishlist:', error.message);
    }
  };

  const debouncedSaveCart = debounce(saveCartToBackend, 3000);
  const debouncedSaveWishlist = debounce(saveWishlistToBackend, 3000);

  useEffect(() => {
    if (auth?.userId) {
      debouncedSaveCart(cart);
    }
  }, [cart]);

  useEffect(() => {
    if (auth?.userId) {
      debouncedSaveWishlist(wishlist);
    }
  }, [wishlist]);

  if (loading) {
    return <Loader size='lg' color='green' text="Loading..." />;
  }

  return (
  <div className="App">
      <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          
          <Route path="/products" element={<Shop products={products} sortOptions={sortOptions} sort={sort} setSort={setSort} wishlist={wishlist} setWishlist={setWishlist} />} />
          <Route path="/products/:id" element={<Product products={products} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
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
                <Cart cart={cart} setCart={setCart} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist wishlist={wishlist} setWishlist={setWishlist} sortOptions={sortOptions} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/catalog"
            element={
              <ProtectedRoute>
                <Catalog catalog={products} sortOptions={sortOptions} sort={sort} setSort={setSort} />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      <Footer />
  </div>
  );
}

export default App;
