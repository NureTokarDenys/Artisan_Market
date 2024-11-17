import ProfileInput from '../components/ProfileInput';
import ProfileSelect from '../components/ProfileSelect';
import ProfileButton from '../components/ProfileButton';
import './Profile.css';

const Profile = ({currencies, languages}) => {
  const updateProfile = (e) => {
    e.preventDefault();
     // TODO set profile to db
  }

  const resetProfile = (e) => {
    e.preventDefault();
    // TODO get profile from db
  }
  
  return (
    <form className='profile'>
      <p className='title'>Account Settings</p>
      <div className='avatar_bio'>
        <div className='avatarContainer'>
          <p className='avatarText'>Your profile picture</p>
          <div className='avatar'>Upload your photo</div> {/* TODO */}
        </div>
        <div className='bioContainer'>
          <p className='bioText'>Bio</p>
          <textarea id='bio' className='bio' placeholder='Write your bio here e.g. your hobbies, interests, ETC'></textarea>
        </div>
      </div>
      <div className='additionalInfo'> {/* TODO Add useState */}
        <ProfileInput title={"Location"}/> 
        <ProfileInput title={"Email"}/>
        <ProfileInput title={"Phone number"}/>
        <div className='currency_languageContainer'> 
          <ProfileSelect title={"Currency"} array={currencies}/>
          <ProfileSelect title={"Language"} array={languages}/>
        </div>
      </div>
      <div className='paymentInfo'>
        <ProfileInput title={"Cart information"} placeholder={"0000 0000 0000 0000"} /> 
        <div className='date_cvv'>
          <ProfileInput placeholder={"MM/YY"}/> 
          <ProfileInput placeholder={"CVV"}/> 
        </div>
        <ProfileInput title={"Name on card"} placeholder={"Name"}/> 
      </div>
      <div className='actions'>
        <ProfileButton title={"Update profile"} bgColor={"#84a98c"} hoverColor={"#3acf46"} action={updateProfile} />
        <ProfileButton title={"Reset"} bgColor={"#efefef"} hoverColor ={"#d3d3d3"} action={resetProfile} />
      </div>
    </form>
  )
}

export default Profile