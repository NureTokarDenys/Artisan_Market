import ProfileErrorMessage from './ProfileErrorMessage';
import './ProfileInput.css';


const ProfileInput = ({ title = "", name = "", placeholder = title !== "" ? "Enter your " + title.toString().toLowerCase() : "", inputState, inputSetState, errorState, setErrorState, validate }) => {
  const handleSetState = (e) => {
    let val = e.target.value;
    inputSetState(val);

    let invalid = validate(val);
    if(invalid){
      setErrorState(invalid);
    }else {
      setErrorState("");
    }
  }

  return (
    <div className='inputContainer'> 
      <label className='inputLabel' htmlFor={title}>{title}</label>
      <input className='input' name={name} style={{ border: `2px solid ${errorState ? "red" : "black"}` }} id={title} type='text' placeholder={placeholder} value={inputState} onChange={handleSetState} ></input>
      <ProfileErrorMessage ErrorMessage={errorState ? errorState : ""}/>
    </div>
  )
}

export default ProfileInput