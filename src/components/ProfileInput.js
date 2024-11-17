import './ProfileInput.css';

const ProfileInput = ({ title }) => {
  return (
    <div className='inputContainer'> 
          <label className='inputLabel' htmlFor={title}>{title}</label>
          <input className='input' id={title} type='text' placeholder={'Enter your ' + title.toString().toLowerCase()}></input>
        </div>
  )
}

export default ProfileInput