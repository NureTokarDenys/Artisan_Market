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

  // Temp Products
  const [products, setProducts] = useState(
    [
      {
        id: 1,
        name: "Ceramic bowl",
        price: 74.99,
        rating: 3.6,
        totalRatings: 28,
        description: "This handcrafted ceramic bowl set is a perfect addition to your home. Each bowl is carefully crafted from natural clay and kilrr fired at high temperatures. giving it both durability and a unique appearance. Ideal for serving food. adding a decorative touch, or gifting to someone who appreciates original, handmade items,",
        quantity: 4,
        images: [profileImage, "img1.png", "img2.png"],
        colors: ['#996d37']
      },
      {
        id: 2,
        name: "Handwoven Macramé Wall Hanging",
        price: 89.99,
        rating: 4.8,
        totalRatings: 71,
        description: "Elevate your home decor with this intricate macramé wall hanging, meticulously crafted by skilled artisans. Each piece is hand-knotted using 100% natural cotton cord, creating a beautiful textural art piece that adds warmth and bohemian elegance to any room. Unique and carefully constructed, this wall hanging is perfect for those who appreciate handmade craftsmanship.",
        quantity: 3,
        images: [profileImage, "macrame1.png", "macrame2.png"],
        colors: ['#996d37']
      },
      {
        id: 3,
        name: "Hand-Thrown Pottery Vase",
        price: 65.50,
        rating: 4.1,
        totalRatings: 16,
        description: "This elegant pottery vase is a true work of art, individually thrown and glazed by a local ceramicist. Made from high-quality clay and finished with a stunning matte glaze, each vase has unique imperfections that tell a story of handcrafted beauty. Ideal for displaying fresh flowers or as a standalone decorative piece.",
        quantity: 5,
        images: [profileImage, "vase1.png", "vase2.png"],
        colors: ['#996d37']
      },
      {
        id: 4,
        name: "Handknitted Wool Throw Blanket",
        price: 129.99,
        rating: 4.2,
        totalRatings: 8,
        description: "Wrap yourself in comfort with this luxurious hand-knitted wool blanket. Crafted using traditional knitting techniques, each blanket is made from 100% merino wool and features intricate patterns and rich, natural colors. Soft, warm, and meticulously created, this blanket is both a functional piece and a testament to artisanal craftsmanship.",
        quantity: 2,
        images: [profileImage, "blanket1.png", "blanket2.png"],
        colors: ['#996d37']
      },
      {
        id: 5,
        name: "Handcrafted Leather Journal",
        price: 54.75,
        rating: 4.7,
        totalRatings: 39,
        description: "A beautifully crafted leather journal that combines functionality with artistic design. Each journal is carefully handmade using premium vegetable-tanned leather, with hand-stitched binding and high-quality blank pages. Perfect for writers, artists, and those who appreciate the art of traditional bookmaking.",
        quantity: 6,
        images: [profileImage, "journal1.png", "journal2.png"],
        colors: ['#996d37']
      },
      {
        id: 6,
        name: "Hand-Painted Wooden Serving Tray",
        price: 79.25,
        rating: 4.6,
        totalRatings: 52,
        description: "This exquisite wooden serving tray is a unique piece of functional art. Carefully crafted from solid wood and hand-painted with intricate designs, each tray is a one-of-a-kind creation. Perfect for serving breakfast in bed, displaying decorative items, or adding a touch of artisan charm to your home.",
        quantity: 4,
        images: [profileImage, "tray1.png", "tray2.png"],
        colors: ['#996d37']
      }
  ]);

  return (
    <div className="App">
      <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            
            <Route path="/products" element={<Shop products={products} />} />
            <Route path="/products/:id" element={<Product products={products} />} />
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
