import Article from '../components/article';
import Paragraph from '../components/paragraph';
import './About.css';

const About = () => {
  return (
    <main className='aboutMain'>
      <Article header={"About Artisan Market"} paragraph={"Welcome to Artisan Market, your premier destination for unique, handcrafted products created by talented artisans from around the world."} />
      <Article header={"Our Mission"} paragraph={"We connect passionate craftspeople with buyers who appreciate the beauty and quality of handmade items. Our platform empowers artisans to share their craft while providing shoppers with access to authentic, one-of-a-kind products."} />
      <Article header={"What Makes Us Special"} paragraph={["Direct Artist Connection: Buy directly from craftspeople and build meaningful relationships with the makers of your favorite items", 
                                                            "Quality Assurance: Every seller is carefully vetted to ensure the highest standards of craftsmanship", 
                                                            "Global Reach: Browse handcrafted items from artisans worldwide, with support for multiple languages and currencies", 
                                                            "Secure Trading: Our protected payment system and dispute resolution process ensure safe transactions for both buyers and sellers", 
                                                            "Community-Driven: Our review system and referral program help build a trusted community of craft enthusiasts"]} 
                                                            isList={true} isBoldWorded={true} />
      <Article header={"For Buyers"} paragraph={["Discover unique handcrafted products",
                                                  "Shop with confidence using our secure payment system",
                                                  "Track your orders easily",
                                                  "Share your experience through reviews", 
                                                  "Earn rewards by referring friends",
                                                  "Access customer support when needed"]} 
                                                  isList={true}/>
      <Article header={"For Sellers"} paragraph={["Reach a global audience passionate about handmade items",
                                                  "Easy-to-use tools for managing your shop",
                                                  "Detailed analytics to track your performance",
                                                  "Flexible shipping options",
                                                  "Fair dispute resolution process",
                                                  "Professional support for growing your business"]}
                                                isList={true}/>
      <Article header={"Our Values"} paragraph={["Authenticity: We celebrate genuine handcrafted work",
                                                  "Community: We foster connections between artisans and buyers",
                                                  "Quality: We maintain high standards for all products",
                                                  "Trust: We ensure safe and reliable transactions",
                                                  "Growth: We support artisans in building successful businesses"]}
                                                  isList={true} isBoldWorded={true}/>
                                                  
      <Paragraph text={"Join our growing community of craft enthusiasts and artisans. Whether you're here to shop or sell, Artisan Market is your home for authentic handmade products."} />
      <Paragraph text={"Artisan Market - Where Craft Meets Community"} cursive={true}/>
    </main>
  )
}

export default About