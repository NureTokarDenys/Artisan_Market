import { useState } from 'react';
import { Image } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import './SellerProductCard.css';
import ProfileButton from './ProfileButton';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const SellerProductCard = ({ product, setProducts }) => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const imagesLength = product.images.length;
    const [activeImage, setActiveImage] = useState(0);
    const [activeState, setActiveState] = useState(product.status);
    const handleRightArrowClick = () => {
        if (imagesLength === 1) {
            return;
        }
        if (activeImage + 1 < imagesLength){
            setActiveImage(activeImage + 1);
        }
    }

    const handleLeftArrowClick = () => {
        if (imagesLength === 1) {
            return;
        }
        if (activeImage - 1 >= 0){
            setActiveImage(activeImage - 1);
        }
    }

    const handleEdit = () => {
        navigate(`/catalog/edit/${product._id}`);
    }

    const handleShow = async () => {
        product.status = "Active";
        setActiveState(product.status);
        const response = await axiosPrivate.post(`/api/products/status/${product._id}`, { status: product.status });
        setProducts((prevProducts) => {
            return prevProducts.map((item) => {
              if (item._id === product._id) {
                return {
                  ...item,
                  status: "Active",
                };
              }
              return item;
            });
        });
    }

    const handleHide = async () => {
        product.status = "Hidden";
        setActiveState(product.status);
        const response = await axiosPrivate.post(`/api/products/status/${product._id}`, { status: product.status });
        setProducts((prevProducts) => {
            return prevProducts.map((item) => {
              if (item._id === product._id) {
                return {
                  ...item,
                  status: "Hidden",
                };
              }
              return item;
            });
        })
    }

    const handleDelete = async () => {
        product.status = "Deleted";
        setActiveState(product.status);
        const response = await axiosPrivate.post(`/api/products/status/${product._id}`, { status: product.status });
        setProducts((prevProducts) => {
            return prevProducts.map((item) => {
              if (item._id === product._id) {
                return {
                  ...item,
                  status: "Deleted",
                };
              }
              return item;
            });
        })
    }

    const handleRepublish = async () => {
        product.status = "Active";
        setActiveState(product.status);
        const response = await axiosPrivate.post(`/api/products/status/${product._id}`, { status: product.status });
        setProducts((prevProducts) => {
            return prevProducts.map((item) => {
              if (item._id === product._id) {
                return {
                  ...item,
                  status: "Active",
                };
              }
              return item;
            });
        })
    }

  return (
    <div className="seller-product-card">
        <div className='seller-product-card-image-wrapper'>
            <FaAngleLeft size={25} onClick={handleLeftArrowClick} opacity={activeImage - 1 < 0 ? 0.3 : 1} />
            <Image src={product.images[activeImage]} alt={product.name} className="seller-product-image" />
            <FaAngleRight size={25} onClick={handleRightArrowClick} opacity={activeImage + 1 >= imagesLength ? 0.3 : 1} />
        </div>
        <div className="seller-product-info">
          <h2 className="seller-product-name">Product: {product.name}</h2>
          <h2 className="seller-product-price">Price: ${product.price.toFixed(2)}</h2>
          <h2 className="seller-product-stock">Stock: {product.quantity} pcs</h2> 
          <h2 className="seller-product-status"><p>Status:</p><p className={activeState?.toLowerCase()}>{activeState}</p></h2>
        </div>
        <div className='seller-product-actions' style={{ justifyContent: activeState === "Deleted" ? "space-between" : "center" }}>
            {activeState === "Deleted" && 
                <>
                    <ProfileButton title='Edit' border='1px solid #3acf46' textColor='#3acf46' bgColor='#ffffff' hoverColor='#3acf46' hoverTextColor='#000000' action={handleEdit} />
                    <ProfileButton title='Republish' border='1px solid #3acf46' textColor='#3acf46' bgColor='#ffffff' hoverColor='#3acf46' hoverTextColor='#000000' action={handleRepublish} />
                </>
            }
            {activeState === "Hidden" && 
                <>
                    <ProfileButton title='Edit' border='1px solid #3acf46' textColor='#3acf46' bgColor='#ffffff' hoverColor='#3acf46' hoverTextColor='#000000' action={handleEdit} />
                    <ProfileButton title='Show' border='1px solid #3acf46' textColor='#3acf46' bgColor='#ffffff' hoverColor='#3acf46' hoverTextColor='#000000' action={handleShow} />
                    <ProfileButton title='Delete' border='1px solid #EB001A' textColor='#EB001A' bgColor='#ffffff' hoverColor='#EB001A' hoverTextColor='#000000' action={handleDelete} />
                </>
            }
            {activeState === "Active" && 
                <>
                    <ProfileButton title='Edit' border='1px solid #3acf46' textColor='#3acf46' bgColor='#ffffff' hoverColor='#3acf46' hoverTextColor='#000000' action={handleEdit} />
                    <ProfileButton title='Hide' border='1px solid #3acf46' textColor='#3acf46' bgColor='#ffffff' hoverColor='#3acf46' hoverTextColor='#000000' action={handleHide} />
                    <ProfileButton title='Delete' border='1px solid #EB001A' textColor='#EB001A' bgColor='#ffffff' hoverColor='#EB001A' hoverTextColor='#000000' action={handleDelete} />
                </>
            }
        </div>
    </div>
  );
};

export default SellerProductCard;
