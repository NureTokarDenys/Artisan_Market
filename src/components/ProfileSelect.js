import './ProfileSelect.css';

const ProfileSelect = ({ title = "", array, state, setState }) => {
  const handleChange = (event) => {
    setState(event.target.value); 
  };

  return (
    <div className='selectContainer'>
            <label htmlFor={title}>{title}</label>
            <select name={title} id={title} value={state} onChange={handleChange}>
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