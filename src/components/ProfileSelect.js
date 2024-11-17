import './ProfileSelect.css';

const ProfileSelect = ({ title, array }) => {
  return (
    <div className='selectContainer'>
            <label htmlFor={title}>{title}</label>
            <select name={title} id={title}>
              {array.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
  )
}

export default ProfileSelect