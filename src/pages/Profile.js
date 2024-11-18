import ProfileInput from '../components/ProfileInput';
import ProfileSelect from '../components/ProfileSelect';
import ProfileButton from '../components/ProfileButton';
import ProfileErrorMessage from '../components/ProfileErrorMessage';
import './Profile.css';
import { FaPenToSquare } from "react-icons/fa6";
import { useRef, useState } from 'react';
import { Image } from 'semantic-ui-react';

const Profile = ({currencies, languages, bio, setBio, location, setLocation, email, setEmail, phone, setPhone, currency, setCurrency, language, setLanguage, cardNumber, setCardNumber, cardDate, setCardDate, cardCVV, setCardCVV, cardName, setCardName, profileImage, setProfileImage  }) => {

  const handleBioChange = (e) => {
    setBio(e.target.value);
  }

  const validateLocation = (location) => {
    if(!location) return "Location is empty."
    if(Number(location)) return "Location cannot be a number."
    
    let splittedLoc = location.split(", ");
    if(splittedLoc.length !== 2) return "Invalid location format. Please follow: City, Country."
    if((!/^[A-Z][a-z]*$/.test(splittedLoc[0])) || (!/^[A-Z][a-z]*$/.test(splittedLoc[1]))) return "Words must be lower case and capitalized. Please follow: City, Country."
  }

  const validateEmail = (email) => {
    if(!email) return "Email is empty."
    if(Number(email)) return "Email cannot be a number."

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email)) return "Email has a wrong format."
  }

  const validatePhone = (phone) => {
    if(!phone) return "Phone is empty."

    const phoneRegex = /^[+]?[\d\s()-]+$/;
    if(!phoneRegex.test(phone)) return "Phone is invalid."
    if(phone.length < 8) return "Phone is too short."
  }

  const checkLuhn = (cardNumber) => {
    let s = 0;
    let doubleDigit = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = +cardNumber[i];
        if (doubleDigit) {
            digit *= 2;
            if (digit > 9)
                digit -= 9;
        }
        s += digit;
        doubleDigit = !doubleDigit;
    }
    return s % 10 == 0;
}
  const validateCardNumber = (cardNum) => {
    if(!cardNum) return;
    let cardNumber = cardNum.replaceAll(" ", "");
    console.log(cardNum + " || " + cardNumber);
      return (cardNumber && checkLuhn(cardNumber) &&
        cardNumber.length == 16 && (cardNumber[0] == 4 || cardNumber[0] == 5 && cardNumber[1] >= 1 && cardNumber[1] <= 5 ||
        (cardNumber.indexOf("6011") == 0 || cardNumber.indexOf("65") == 0)) ||
        cardNumber.length == 15 && (cardNumber.indexOf("34") == 0 || cardNumber.indexOf("37") == 0) ||
        cardNumber.length == 13 && cardNumber[0] == 4) ? "" : "Card number is invalid." 
  }

  const validateCardDate = (date) => {
    if(!date) return;
    if(Number(date) && date.length === 4) return "Wrong format. Use MM/YY.";
    let dateSplit = date.split("/");
    if(dateSplit.length !== 2) return "Invalid date. Use MM/YY.";
    if(dateSplit[0].length !== 2) return "Incorrect month format.";
    if(dateSplit[1].length !== 2) return "Incorrect year format.";
    if((Number(dateSplit[0]) < 0) || (Number(dateSplit[0]) > 12)) return "Invalid month.";
    if(Number(dateSplit[1]) < 24) return "Invalid year.";
  }

  const validateCardCVV = (cvv) => {
    if(!cvv) return;
    if(!Number(cvv)) return "CVV is a number.";
    if(cvv.length !== 3) return "CVV must contain 3 digits.";
  }

  const validateCardName = (name) => {
    if(!name) return;
    if(Number(name)) return "Card holders name cannot be a number.";
    const cardNameRegex = /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/;
    if(!cardNameRegex.test(name)) return "Invalid name. Make sure it starts with a capital letter and contains only letters and spaces."
  }

  const updateProfile = (e) => {
    e.preventDefault();
     // TODO save profile to db
  }

  const resetProfile = (e) => {
    e.preventDefault();
    // TODO get profile from db
  }

  // Image Ref
  const imagePickRef = useRef(null);

  const choseImage = () => {
    if (imagePickRef.current) {
      imagePickRef.current.click();
    }
  }

  const onImageChange = (e) => {
    e.persist();
    const file = e.target.files[0];
    const fileURL = URL.createObjectURL(file);
    if(fileURL) setProfileImage(fileURL);
  }

  // Error States
  const [imageError, setImageError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [cardDateError, setCardDateError] = useState("");
  const [cardCVVError, setCardCVVError] = useState("");
  const [cardNameError, setCardNameError] = useState("");

  return (
    <div className='main'>
      <form className='profile'>
        <p className='title'>Account Settings</p>
        <div className='avatar_bio'>
          <div className='avatarContainer'>
            <div className='avatarText'>Your profile picture
              <FaPenToSquare className='edit-icon' onClick={choseImage} />
            </div>
            <input type='file' ref={imagePickRef} onChange={onImageChange} hidden />
            {profileImage ? (<Image src={profileImage} className='profileImage' /> ) 
            : (<div className='avatar' onClick={choseImage} >Upload your photo</div>)}
            <ProfileErrorMessage ErrorMessage={imageError}/>
          </div>
          <div className='bioContainer'>
            <p className='bioText'>Bio</p>
            <textarea id='bio' className='bio' placeholder='Write your bio here e.g. your hobbies, interests, ETC' value={bio} onChange={handleBioChange}></textarea>
          </div>
        </div>
        <div className='additionalInfo'>
          <ProfileInput title={"Location"} placeholder='For example: Paris, France' inputState={location} inputSetState={setLocation} errorState={locationError} setErrorState={setLocationError} validate={validateLocation} /> 
          <ProfileInput title={"Email"} inputState={email} inputSetState={setEmail} errorState={emailError} setErrorState={setEmailError} validate={validateEmail}/>
          <ProfileInput title={"Phone number"} inputState={phone} inputSetState={setPhone} errorState={phoneError} setErrorState={setPhoneError} validate={validatePhone}/>
          <div className='currency_languageContainer'> 
            <ProfileSelect title={"Currency"} array={currencies} state={currency} setState={setCurrency} />
            <ProfileSelect title={"Language"} array={languages} state={language} setState={setLanguage} />
          </div>
        </div>
        <div className='paymentInfo'>
          <ProfileInput title={"Card information"} placeholder={"0000 0000 0000 0000"} inputState={cardNumber} inputSetState={setCardNumber} errorState={cardNumberError} setErrorState={setCardNumberError} validate={validateCardNumber} /> 
          <div className='date_cvv'>
            <ProfileInput placeholder={"MM/YY"} inputState={cardDate} inputSetState={setCardDate} errorState={cardDateError} setErrorState={setCardDateError} validate={validateCardDate} /> 
            <ProfileInput placeholder={"CVV"} inputState={cardCVV} inputSetState={setCardCVV} errorState={cardCVVError} setErrorState={setCardCVVError} validate={validateCardCVV} /> 
          </div>
          <ProfileInput title={"Name on card"} placeholder={"Name"} inputState={cardName} inputSetState={setCardName} errorState={cardNameError} setErrorState={setCardNameError} validate={validateCardName} /> 
        </div>
        <div className='actions'>
          <ProfileButton title={"Update profile"} bgColor={"#84a98c"} hoverColor={"#3acf46"} action={updateProfile} />
          <ProfileButton title={"Reset"} bgColor={"#efefef"} hoverColor ={"#d3d3d3"} action={resetProfile} />
        </div>
      </form>
    </div>
  )
}

export default Profile