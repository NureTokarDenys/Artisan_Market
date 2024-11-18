import Article from '../components/article';
import Paragraph from '../components/paragraph';
import './Contact.css';

const Contact = () => {
  return (
    <main className='contact'>
      <Article header={"Contact Us"} paragraph={"We're here to help make your Artisan Market experience exceptional. Choose the most convenient way to reach us."} />
      <Article header={"Quick Support Options For Buyers"} paragraph={["Order Issues → Visit your Order History and select the specific order",
                                                                        "Product Questions → Contact sellers directly through the product page",
                                                                        "Payment Problems → Use our Payment Support Form",
                                                                        "Account Issues → Visit our Account Help Center"]} 
                                                                        isList={true} />
      <Article header={"Quick Support Options For Sellers"} paragraph={["Shop Management → Access your Seller Dashboard",
                                                                        "Payment & Payout Issues → Contact our Seller Support team",
                                                                        "Technical Assistance → Submit a request through the Seller Help Portal",
                                                                        "Listing Problems → Use our Product Management Support form"]} 
                                                                        isList={true} />
      <Article header={"Connect With Us"} paragraph={["Email: support@artisanmarket.com",
                                                      "Phone: +123456789",
                                                      "Business Inquiries: business@artisanmarket.com",
                                                      "Partnerships: partners@artisanmarket.com"]} 
                                                      isList={true} />
      <Article header={"Follow Us"} paragraph={["Facebook",
                                                "Instagram",
                                                "Twitter",
                                                "LinkedIn"]} 
                                                isList={true} />                                           
    </main>
  )
}

export default Contact