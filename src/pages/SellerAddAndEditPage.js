import { useRef, useState } from 'react';
import ProfileInput from '../components/ProfileInput';
import './SellerAddAndEditPage.css';
import { Image } from 'semantic-ui-react';
import { FaUpload, FaXmark } from "react-icons/fa6";
import ProfileErrorMessage from '../components/ProfileErrorMessage';
import ProfileButton from '../components/ProfileButton';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

const SellerAddAndEditPage = ({ title="Add New Product", edit = false, products }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products?.find(item => item._id === id);
  if(edit && !product){
      return (
        <Navigate to="/ProductNotFound" replace />
      );
  }

  const [prod, setProd] = useState({
    title: "",
    price: "",
    quantity: "",
    category: "",
    description: ""
 });

  const [activeImage, setActiveImage] = useState(product?.images[0]);
  const [addedImages, setAddedImages] = useState(product?.images || []);
  const [imageFiles, setImageFiles] = useState([]);

  const [errors, setErrors] = useState({
    imageError: "",
    titleError: "",
    priceError: "",
    quantityError: "",
    categoryError: "",

  });

  if(edit){
    prod.title = product.name;
    prod.price = product.price;
    prod.quantity = product.quantity;
    prod.description = product.description;
  }

  const save = () => {
    if(edit){

    }else {

    }
  }

  const cancel = () => {
    navigate("/catalog");
  }

  // Image Ref
  const imagePickRef = useRef(null);

  const choseImage = () => {
    if (imagePickRef.current) {
      imagePickRef.current.click();
    }
  };

  const onImageChange = async (e) => {
    e.persist();
    const file = e.target.files[0];
  
    if (!file) return;

    setErrors((prevErrors) => ({
      ...prevErrors,
      imageError: "",
    }));
  
    const maxSize = 2 * 1024 * 1024; // 2MB
  
    const allowedExtensions = ["image/png", "image/jpeg"];
  
    if (!allowedExtensions.includes(file.type)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        imageError: "Only .png, .jpg files are allowed.",
      }));
      return;
    }
  
    if (file.size > maxSize) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        imageError: "File size must be less than 2MB.",
      }));
      return;
    }
  
    const fileURL = URL.createObjectURL(file);
    if (fileURL) {
      
    }
  
    setImageFiles((prevImageFiles) => [...prevImageFiles, file]);
    setAddedImages((prev) => [...prev, fileURL]);
    
  };

  // Validation Functions
  const validatePrice = (price) => {
    if (price === undefined || price === null) return "";
    if (isNaN(price)) return "Price must be a number.";
    if (price <= 0) return "Price must be greater than zero.";
    if (!/^\d+(\.\d{1,2})?$/.test(price)) return "Price must have at most two decimal places.";
  };

  const validateQuantity = (quantity) => {
    if (quantity === undefined || quantity === null) return "";
    if (!Number.isInteger(Number(quantity))) return "Quantity must be an integer.";
    if (quantity <= 0) return "Quantity must be greater than zero.";
  };

  const validateCategory = (category) => {
    if (!category) return "";
    if (Number(category)) return "Category cannot be a number.";
    if (!/^[A-Za-z\s]+$/.test(category)) return "Category must only contain letters and spaces.";
    if (category.length < 3) return "Category must be at least 3 characters long.";
  };

  const validateProductTitle = (title) => {
    if (!title) return "";
    if (title.length < 3) return "Product title must be at least 3 characters long.";
    if (!/^[A-Za-z0-9\s.,'-]+$/.test(title)) return "Product title contains invalid characters.";
    if (title.length > 100) return "Product title must not exceed 100 characters.";
  };

  const deleteImage = (image) => {
    setAddedImages((prevImages) => {
      const updatedImages = prevImages.filter((img) => img !== image);
      
      if (activeImage === image) {
        setActiveImage(updatedImages[0] || null); 
      }
  
      return updatedImages;
    });
  
    setImageFiles((prevFiles) =>
      prevFiles.filter((file) => URL.createObjectURL(file) !== image)
    );
  };
  

  return (
    <main className='seller-page-main'>
      <div className='seller-page-container'>
        <h1 className='seller-page-header'>{title}</h1>
        <div className='image-title-container'>
          <div className='image-container'>
            <div className='avatarText'>Product Image</div>
            <input type='file' ref={imagePickRef} onChange={onImageChange} hidden />
            {activeImage ? (
              <Image src={activeImage} className='productImage' />
            ) : (
              <div className='avatar' onClick={choseImage}>Upload product photo</div>
            )}
            <ProfileErrorMessage ErrorMessage={errors.imageError} />
          </div>
          <div className='title-container'>
            <ProfileInput divClassName='title-input-div' inputClassName='title-input' title='Product Title' placeholder='Enter the product title (e.g., Handmade Mug)' inputState={prod.title} inputSetState={(value) => setProd((prevProd) => ({ ...prevProd, title: value }))} errorState={errors.titleError} setErrorState={(error) => setErrors((prev) => ({ ...prev, titleError: error }))} validate={validateProductTitle} />
            <ProfileButton action={choseImage} className='upload-button' title='Upload Image' border='2px solid #000000' textColor='#000000' icon={<FaUpload />} />
            <div className='uploaded-images-container'>
              {addedImages.map((image, i) => (
                  <button className={`${activeImage === image ? "active-image" : "uploaded-image"}`} onClick={() => setActiveImage(image)}>
                    {"image" + (i+1) + ".png"}
                    <FaXmark className="delete-image-icon" name={image} onClick={(e) => {
                      e.stopPropagation(); 
                      deleteImage(image);
                    }} />
                  </button>
              ))}
            </div>
          </div>
        </div>
        <div className='product-info'>
          <div className='product-info-simpleFields'>
            <ProfileInput title='Price' placeholder='Enter the price' inputState={prod.price} inputSetState={(value) => setProd((prevProd) => ({ ...prevProd, price: value }))} errorState={errors.priceError} setErrorState={(error) => setErrors((prev) => ({ ...prev, priceError: error }))} validate={validatePrice} />
            <ProfileInput title='Stock quantity' placeholder='Enter stock quantity' inputState={prod.quantity} inputSetState={(value) => setProd((prevProd) => ({ ...prevProd, quantity: value }))} errorState={errors.quantityError} setErrorState={(error) => setErrors((prev) => ({ ...prev, quantityError: error }))} validate={validateQuantity} />
            <ProfileInput title='Category' placeholder='Enter category' inputState={prod.category} inputSetState={(value) => setProd((prevProd) => ({ ...prevProd, category: value }))} errorState={errors.categoryError} setErrorState={(error) => setErrors((prev) => ({ ...prev, categoryError: error }))} validate={validateCategory} />
          </div>
          <div className='descContainer'>
            <p className='descText'>Description</p>
            <textarea
              id='desc'
              className='desc'
              placeholder='Write your product description here'
              value={prod.description}
              name="desc"
              onChange={(event) => setProd((prevProd) => ({ ...prevProd, description: event.target.value }))}
            />
          </div>
        </div>
        <div className='product-actions'>
        <ProfileButton action={save} title={edit ? "Save Changes" : "Save and Publish"} textColor='#FFFFFF' bgColor='#84A98C' hoverColor='#0cad19' />
        <ProfileButton action={cancel} title='Cancel' textColor='#000000' bgColor='#efefef' hoverColor='#d3d3d3' />
        </div>
      </div>
    </main>
  );
};

export default SellerAddAndEditPage;