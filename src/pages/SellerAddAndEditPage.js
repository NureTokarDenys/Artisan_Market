import { useEffect, useRef, useState } from 'react';
import ProfileInput from '../components/ProfileInput';
import './SellerAddAndEditPage.css';
import { Image } from 'semantic-ui-react';
import { FaUpload, FaXmark } from "react-icons/fa6";
import ProfileErrorMessage from '../components/ProfileErrorMessage';
import ProfileButton from '../components/ProfileButton';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import axios from '../api/axios';

const SellerAddAndEditPage = ({ title="Add New Product", edit = false, products, setProducts }) => {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { auth } = useAuth();
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
    saveError: "",
    saveMessage: ""
  });

  useEffect(() => {
    if (edit && product) {
      setProd({
        title: product.name,
        price: product.price,
        quantity: product.quantity,
        category: product.category,
        description: product.description
      });
      setAddedImages(product.images || []);
      setActiveImage(product.images?.[0] || null);
      setImageFiles([]); 
    } else {
      setProd({
        title: "",
        price: "",
        quantity: "",
        category: "",
        description: ""
      });
      setAddedImages([]);
      setActiveImage(null);
      setImageFiles([]);
    }
  }, [edit, product, id]);

  const save = async () => {
    const savedImages = await saveImages();
    if(!edit && (savedImages.length === 0)){
      setErrors((prev) => ({ ...prev, saveError: "At least one image is required" }));
      return;
    }
    if(!prod.title) {
      setErrors((prev) => ({ ...prev, saveError: "Product title is required" }))
      return;
    }
    if(!prod.price) {
      setErrors((prev) => ({ ...prev, saveError: "Price is required" }))
      return;
    }
    if(!prod.quantity) {
      setErrors((prev) => ({ ...prev, saveError: "Quantity is required" }))
      return;
    }
      
    
    if(edit){
      const alreadyExist = addExistant();
      if(alreadyExist != []){
        savedImages.unshift(...alreadyExist);
      }
      if((savedImages.length === 0)){
        setErrors((prev) => ({ ...prev, saveError: "At least one image is required" }));
        return;
      }

      const result = await axiosPrivate.put(`/api/products/${product._id}` , {
        name: prod.title,
        price: parseFloat(prod.price),
        description: prod.description,
        quantity: Number(prod.quantity),
        images: savedImages,
        colors: [],
        status: "Active"
      });

      if(result.status == '200'){
        setErrors((prev) => ({ ...prev, saveMessage: "Product saved successfully" }));
        setProducts((prevProducts) => {
          return prevProducts.map((item) => {
            if (item._id === product._id) {
              return {
                ...item,
                name: prod.title,
                price: parseFloat(prod.price),
                description: prod.description,
                quantity: Number(prod.quantity),
                images: savedImages,
                status: "Active",
              };
            }
            
            return item;
          });
        });
      }else {
        setErrors((prev) => ({ ...prev, saveError: result.data.error }))
      }

    }else {
      const result = await axiosPrivate.post("/api/products", {
        userId: auth.userId,
        name: prod.title,
        price: parseFloat(prod.price),
        rating: 0,
        totalRatings: 0,
        description: prod.description,
        quantity: Number(prod.quantity),
        images: savedImages,
        colors: [],
        status: "Active"
      });

      if(result.status == '201'){
        setProducts((prevProducts) => [
          ...prevProducts,  {
            _id: result.data.insertedId,
            userId: auth.userId,
            name: prod.title,
            price: parseFloat(prod.price),
            rating: 0,
            totalRatings: 0,
            description: prod.description,
            quantity: Number(prod.quantity),
            images: savedImages,
            colors: [],
            status: "Active"
          }
        ]);
        navigate("/catalog");
      }else {
        setErrors((prev) => ({ ...prev, saveError: result.data.error }));
      }
    }
  }

  const cancel = () => {
    navigate("/catalog");
  }

  const addExistant = () => {
    let result = [];
    addedImages.map((image) => {
      product.images.includes(image) && result.push(image);
    });
    return result;
  }

  const saveImages = async () => {
    if (!imageFiles || imageFiles.length === 0) {
      return [];
    }
  
    try {
      const uploadedImageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const response = await axiosPrivate.get("/api/s3/url");
          const { url } = response.data;
  
          await axios.put(url, file, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log(url.split("?")[0]);
          return url.split("?")[0];
        })
      );

      return uploadedImageUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload images. Please try again.");
    }
  };
  

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
  
    setImageFiles((prevImageFiles) => [...prevImageFiles, file]);
    setAddedImages((prev) => [...prev, fileURL]);
    setActiveImage(fileURL);
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
            <div className='avatar-Text'>Product Image</div>
            <input type='file' ref={imagePickRef} onChange={onImageChange} hidden />
            {activeImage ? (
              <Image src={activeImage} className='product-Image' />
            ) : (
              <div className='product-avatar' onClick={choseImage}>Upload product photo</div>
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
        <div className='seller-product-info-edit'>
          <div className='seller-product-info-simpleFields'>
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
        <div className='seller-product-action-buttons'>
        <ProfileButton action={save} title={edit ? "Save Changes" : "Save and Publish"} textColor='#FFFFFF' bgColor='#84A98C' hoverColor='#0cad19' />
        <ProfileButton action={cancel} title='Cancel' textColor='#000000' bgColor='#efefef' hoverColor='#d3d3d3' />
        </div>
        <div className='messages'>
              {errors.saveMessage && (
                  <div className="message-success">
                    {errors.saveMessage}
                  </div>
              )}
              {errors.saveError && (
                  <div className="message-error">
                    {errors.saveError}
                  </div>
              )}
              </div>
      </div>
    </main>
  );
};

export default SellerAddAndEditPage;