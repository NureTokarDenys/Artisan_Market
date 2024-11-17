import './ProfileInput.css';

const ProfileInput = ({ title = "", placeholder = title !== "" ? "Enter your " + title.toString().toLowerCase() : "" }) => {
  return (
    <div className='inputContainer'> 
          <label className='inputLabel' htmlFor={title}>{title}</label>
          <input className='input' id={title} type='text' placeholder={placeholder}></input>
        </div>
  )
}

export default ProfileInput