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
import SellerAddAndEditPage from './pages/SellerAddAndEditPage';
import UnAuthorized from './pages/UnAuthorized';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Order from './pages/Order';

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
  const [buyerOrders, setBuyerOrders] = useState([]);

  const [catalog, setCatalog] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);

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
            role: authResponse.data.role,
            token: authResponse.data.accessToken,
          });
        } else {
          setAuth({ isAuthenticated: false, role: null, userId: null, token: null });
        }
  
        const productsResponse = await axios.get('/api/products', { signal: controller.signal });
        if (isMounted) setProducts(productsResponse.data);
  
        if (authResponse.data.authenticated) {
          const userId = authResponse.data.userId;

          const profileResponse = await axiosPrivate.get(`/api/profile/${userId}`, { 
            signal: controller.signal, 
          });
          if (isMounted) setProfile(profileResponse.data || {
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

          const buyerOrdersResponse = await axiosPrivate.get(`/api/orders/buyer/${userId}`, {
            signal: controller.signal,
          });
          if (isMounted) setBuyerOrders(buyerOrdersResponse.data.orders || []);


          const cartResponse = await axiosPrivate.get(`/api/cart/${userId}`, {
            signal: controller.signal,
          });
          if (isMounted) setCart(cartResponse.data.cart || []);
  
          const wishlistResponse = await axiosPrivate.get(`/api/wishlist/${userId}`, {
            signal: controller.signal,
          });
          if (isMounted) setWishlist(wishlistResponse.data.wishlist || []);
          
          if(authResponse.data.role == "seller"){
            const catalogResponse = await axiosPrivate.get(`/api/products/user/${userId}`, {
              signal: controller.signal,
            });
           
            if (isMounted) setCatalog(catalogResponse.data || []);
          }
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
  }, [auth?.userId]);
  
  useEffect(() => {
    const catal = products.filter((prod) => prod?.userId === auth?.userId);
    setCatalog(catal);
  }, [products, auth?.userId]);

  const saveCartToBackend = async (updatedCart) => {
    try {
      await axiosPrivate.post('/api/cart/' + auth.userId, { cart: updatedCart });
    } catch (error) {
      console.error('Failed to save cart:', error.message);
    }
  };

  const saveWishlistToBackend = async (updatedWishlist) => {
    try {
      await axiosPrivate.post('/api/wishlist/' + auth.userId , { wishlist: updatedWishlist });
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
              <ProtectedRoute allowedRoles={['buyer', 'seller']}>
                <Profile
                  profile={profile}
                  setProfile={setProfile}
                  currencies={currencyDir}
                  languages={languageDir}
                  setCart={setCart}
                  setWishlist={setWishlist}
                  setCatalog={setCatalog}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={['buyer', 'seller']}>
                <Cart cart={cart} setCart={setCart} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute allowedRoles={['buyer', 'seller']}>
                <Wishlist wishlist={wishlist} setWishlist={setWishlist} sortOptions={sortOptions} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['buyer', 'seller']}>
                <Orders sortOptions={sortOptions} sort={sort} setSort={setSort} orders={buyerOrders} setorders={setBuyerOrders} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order/:id"
            element={
              <ProtectedRoute allowedRoles={['buyer', 'seller']}>
                <Order orders={buyerOrders} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={['buyer', 'seller']}>
                <Checkout profile={profile} cart={cart} setCart={setCart} setBuyerOrders={setBuyerOrders} />
              </ProtectedRoute>
            }
          />


          <Route
            path="/catalog"
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <Catalog catalog={catalog} sortOptions={sortOptions} sort={sort} setSort={setSort} setProducts={setProducts} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalog/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerAddAndEditPage title='Edit Your Product' edit={true} products={products} setProducts={setProducts} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalog/add"
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerAddAndEditPage title='Add New Product' products={products} setProducts={setProducts} />
              </ProtectedRoute>
            }
          />

          <Route path="/unauthorized" element={<UnAuthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      <Footer />
  </div>
  );
}

export default App;