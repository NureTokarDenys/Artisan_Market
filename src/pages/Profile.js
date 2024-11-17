import ProfileInput from '../components/ProfileInput';
import ProfileSelect from '../components/ProfileSelect';
import './Profile.css';

const Profile = ({currencies, languages}) => {
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
      <div className='additionalInfo'>
        <ProfileInput title={"Location"}/> {/* TODO Add useState */}
        <ProfileInput title={"Email"}/> {/* TODO Add useState */}
        <ProfileInput title={"Phone number"}/> {/* TODO Add useState */}
        <div className='currency_languageContainer'> 
          <ProfileSelect title={"Currency"} array={currencies}/>
          <ProfileSelect title={"Language"} array={languages}/>
        </div>
      </div>
      <div className='paymentInfo'>

      </div>
    </form>
  )
}

export default Profile