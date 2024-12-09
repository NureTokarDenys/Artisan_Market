import './Sorting.css';
import ProfileSelect from "./ProfileSelect.js";

const Sorting = ({ h1, h2, sortOptions, sort, setSort }) => {
  return (
    <div className='sort-component'>
        <h1 className='main-text'>{h1}</h1>
        <h2 className='additional-text'>{h2}</h2>
        <ProfileSelect array={sortOptions} state={sort} setState={setSort} />
    </div>
  )
}

export default Sorting