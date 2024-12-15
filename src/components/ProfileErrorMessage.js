import './ProfileErrorMessage.css';
import { FaCircleExclamation  } from "react-icons/fa6";

const ErrorMessage = ({ ErrorMessage }) => {
  return (
    ErrorMessage ? (
    <label className='errorMessage' ><FaCircleExclamation  />{ErrorMessage}</label>
    ) : (<></>)
  )
}

export default ErrorMessage