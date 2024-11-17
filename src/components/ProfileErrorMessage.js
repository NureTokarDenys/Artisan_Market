import './ProfileErrorMessage.css';

const ErrorMessage = ({ ErrorMessage }) => {
  return (
    ErrorMessage ? (
    <label className='errorMessage' >{ErrorMessage}</label>
    ) : (<></>)
  )
}

export default ErrorMessage