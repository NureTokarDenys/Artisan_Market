import ProfileInput from '../components/ProfileInput';
import ProfileSelect from '../components/ProfileSelect';
import ProfileButton from '../components/ProfileButton';
import ProfileErrorMessage from '../components/ProfileErrorMessage';
import './Profile.css';
import { FaPenToSquare } from "react-icons/fa6";
import { useRef, useEffect, useState } from 'react';
import { Image } from 'semantic-ui-react';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Profile = ({ profile, setProfile, currencies, languages }) => {
  const { auth, logout } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  // Error States
  const [errors, setErrors] = useState({
    imageError: "",
    locationError: "",
    emailError: "",
    phoneError: "",
    cardNumberError: "",
    cardDateError: "",
    cardCVVError: "",
    cardNameError: "",
  });

  // Handle Changes for all fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  // Validation Functions
  const validateLocation = (location) => {
    if (!location) return "Location is empty.";
    if (Number(location)) return "Location cannot be a number.";
    let splittedLoc = location.split(", ");
    if (splittedLoc.length !== 2) return "Invalid location format. Please follow: City, Country.";
    if ((!/^[A-Z][a-z]*$/.test(splittedLoc[0])) || (!/^[A-Z][a-z]*$/.test(splittedLoc[1]))) return "Words must be capitalized. Please follow: City, Country.";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is empty.";
    if (Number(email)) return "Email cannot be a number.";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return "Email has a wrong format.";
  };

  const validatePhone = (phone) => {
    if (!phone) return "Phone is empty.";
    const phoneRegex = /^[+]?[\d\s()-]+$/;
    if (!phoneRegex.test(phone)) return "Phone is invalid.";
    if (phone.length < 8) return "Phone is too short.";
  };

  const checkLuhn = (cardNumber) => {
    let s = 0;
    let doubleDigit = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = +cardNumber[i];
      if (doubleDigit) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      s += digit;
      doubleDigit = !doubleDigit;
    }
    return s % 10 === 0;
  };

  const validateCardNumber = (cardNum) => {
    if (!cardNum) return;
    let cardNumber = cardNum.replaceAll(" ", "");
    return (cardNumber && checkLuhn(cardNumber) &&
      cardNumber.length === 16 && (cardNumber[0] == 4 || (cardNumber[0] == 5 && cardNumber[1] >= 1 && cardNumber[1] <= 5) ||
      (cardNumber.indexOf("6011") === 0 || cardNumber.indexOf("65") === 0)) ||
      cardNumber.length === 15 && (cardNumber.indexOf("34") === 0 || cardNumber.indexOf("37") === 0) ||
      cardNumber.length === 13 && cardNumber[0] === 4) ? "" : "Card number is invalid.";
  };

  const validateCardDate = (date) => {
    if (!date) return;
    if (Number(date) && date.length === 4) return "Wrong format. Use MM/YY.";
    let dateSplit = date.split("/");
    if (dateSplit.length !== 2) return "Invalid date. Use MM/YY.";
    if (dateSplit[0].length !== 2) return "Incorrect month format.";
    if (dateSplit[1].length !== 2) return "Incorrect year format.";
    if ((Number(dateSplit[0]) < 0) || (Number(dateSplit[0]) > 12)) return "Invalid month.";
    if (Number(dateSplit[1]) < 24) return "Invalid year.";
  };

  const validateCardCVV = (cvv) => {
    if (!cvv) return;
    if (!Number(cvv)) return "CVV must be a number.";
    if (cvv.length !== 3) return "CVV must contain 3 digits.";
  };

  const validateCardName = (name) => {
    if (!name) return;
    if (Number(name)) return "Card holder's name cannot be a number.";
    const cardNameRegex = /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/;
    if (!cardNameRegex.test(name)) return "Invalid name. Make sure it starts with a capital letter and contains only letters and spaces.";
  };

  // Update Profile Logic
  const updateProfile = (e) => {
    e.preventDefault();
    try { 
    axiosPrivate.post(`/api/profile/update/${auth.userId}`, {
      profileImage: profile.profileImage, 
      bio: profile.bio, 
      location: profile.location, 
      phone: profile.phone, 
      email: profile.email,
      currency: profile.currency, 
      language: profile.language, 
      isSet: true
    });
    setProfileMessage('Updated successfully');
  }
  catch(err) {
    console.error("Error: " + err);
  }
  };
  
  const resetProfile = (e) => {
    e.preventDefault();
    getProfile("Profile reset");
  };

  // Image Ref
  const imagePickRef = useRef(null);

  const choseImage = () => {
    if (imagePickRef.current) {
      imagePickRef.current.click();
    }
  };

  const onImageChange = (e) => {
    e.persist();
    const file = e.target.files[0];
    const fileURL = URL.createObjectURL(file);
    if (fileURL) setProfile((prevProfile) => ({ ...prevProfile, profileImage: fileURL }));
  };

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true; 
    
    setProfileError("");
    setProfileMessage("");
    
    console.log("!profile: " + !profile.isSet + ", auth.token: " + (auth?.token ? "true" : "false") + ", auth: " + JSON.stringify(auth));
    
    if (!profile.isSet && auth?.token) {
      getProfile("", controller.signal, isMounted);
    }
  
    return () => {
      isMounted = false; 
      controller.abort();
    };
  }, [profile.isSet, auth?.token]);
  
  const getProfile = async (message = "", signal = new AbortController().signal, isMounted = true) => {
    try {
      const response = await axiosPrivate.get(`/api/profile/${auth.userId}`, { signal });
      if (isMounted) {
        setProfile(response.data);
        setProfileMessage(message);
      }
    } catch (err) {
      if(!err?.code === "ERR_CANCELED"){
        console.error('Error fetching profile:', err);
      }else{
        setProfileError(JSON.stringify(err));
      }
    }
  };

  return (
    <div className='main'>
      <form className='profile'>
        <p className='title'>Account Settings</p>
        <div className='avatar_bio'>
          <div className='avatarContainer'>
            <div className='avatarText'>
              Your profile picture
              <FaPenToSquare className='edit-icon' onClick={choseImage} />
            </div>
            <input type='file' ref={imagePickRef} onChange={onImageChange} hidden />
            {profile.profileImage ? (
              <Image src={profile.profileImage} className='profileImage' />
            ) : (
              <div className='avatar' onClick={choseImage}>Upload your photo</div>
            )}
            <ProfileErrorMessage ErrorMessage={errors.imageError} />
          </div>
          <div className='bioContainer'>
            <p className='bioText'>Bio</p>
            <textarea
              id='bio'
              className='bio'
              placeholder='Write your bio here e.g. your hobbies, interests, ETC'
              value={profile.bio}
              name="bio"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='additionalInfo'>
          <ProfileInput
            title={"Location"}
            name={"location"}
            placeholder='For example: Paris, France'
            inputState={profile.location}
            inputSetState={handleChange}
            errorState={errors.locationError}
            setErrorState={(error) => setErrors((prev) => ({ ...prev, locationError: error }))}
            validate={validateLocation}
          />
          <ProfileInput
            title={"Email"}
            name='email'
            inputState={profile.email}
            inputSetState={handleChange}
            errorState={errors.emailError}
            setErrorState={(error) => setErrors((prev) => ({ ...prev, emailError: error }))}
            validate={validateEmail}
          />
          <ProfileInput
            title={"Phone number"}
            name='phone'
            inputState={profile.phone}
            inputSetState={handleChange}
            errorState={errors.phoneError}
            setErrorState={(error) => setErrors((prev) => ({ ...prev, phoneError: error }))}
            validate={validatePhone}
          />
          <div className='currency_languageContainer'>
            <ProfileSelect
              title={"Currency"}
              array={currencies}
              state={profile.currency}
              setState={(value) => setProfile((prevProfile) => ({ ...prevProfile, currency: value }))}
            />
            <ProfileSelect
              title={"Language"}
              array={languages}
              state={profile.language}
              setState={(value) => setProfile((prevProfile) => ({ ...prevProfile, language: value }))}
            />
          </div>
        </div>
        <div className='paymentInfo'>
          <ProfileInput
            title={"Card information"}
            placeholder={"0000 0000 0000 0000"}
            inputState={profile.cardNumber}
            inputSetState={handleChange}
            errorState={errors.cardNumberError}
            setErrorState={(error) => setErrors((prev) => ({ ...prev, cardNumberError: error }))}
            validate={validateCardNumber}
          />
          <div className='date_cvv'>
            <ProfileInput
              placeholder={"MM/YY"}
              inputState={profile.cardDate}
              inputSetState={handleChange}
              errorState={errors.cardDateError}
              setErrorState={(error) => setErrors((prev) => ({ ...prev, cardDateError: error }))}
              validate={validateCardDate}
            />
            <ProfileInput
              placeholder={"CVV"}
              inputState={profile.cardCVV}
              inputSetState={handleChange}
              errorState={errors.cardCVVError}
              setErrorState={(error) => setErrors((prev) => ({ ...prev, cardCVVError: error }))}
              validate={validateCardCVV}
            />
          </div>
          <ProfileInput
            title={"Name on card"}
            placeholder={"Name"}
            inputState={profile.cardName}
            inputSetState={handleChange}
            errorState={errors.cardNameError}
            setErrorState={(error) => setErrors((prev) => ({ ...prev, cardNameError: error }))}
            validate={validateCardName}
          />
        </div>
        <div className='actions-info-logout'>
          <div className='actions-info'>
            <div className='actions'>
              <ProfileButton
                title={"Update profile"}
                bgColor={"#84a98c"}
                hoverColor={"#3acf46"}
                action={updateProfile}
              />
              <ProfileButton
                title={"Reset"}
                bgColor={"#efefef"}
                hoverColor={"#d3d3d3"}
                action={resetProfile}
              />
              <div className='messages'>
              {profileMessage && (
                  <div className="message success">
                    {profileMessage}
                  </div>
              )}
              {profileError && (
                  <div className="message error">
                    {profileError}
                  </div>
              )}
              </div>
            </div>
          </div>
          <div className='logout'>
            <ProfileButton
                title={"Logout"}
                bgColor={"#d64545"}
                hoverColor={"#f07a7a"}
                action={logout}
              />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;