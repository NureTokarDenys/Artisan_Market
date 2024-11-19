import ProfileButton from '../components/ProfileButton';
import './Cart.css';
import { usePopup, POPUP_TYPES } from '../components/PopUpProvider';

const Cart = () => {
  const { openPopup } = usePopup();

  const showLogin = () => {
    openPopup(POPUP_TYPES.LOGIN);
  };

  const showRegister = () => {
    openPopup(POPUP_TYPES.REGISTER);
  };

  return (
    <main>
      <ProfileButton title="Login" textColor="black" bgColor="lightblue" action={showLogin} />
      <ProfileButton title="Register" textColor="black" bgColor="lightgreen" action={showRegister} />
    </main>
  );
};

export default Cart;