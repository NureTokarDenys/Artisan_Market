import './PopUpInput.css';

const PopUpInput = ({ label, type, placeholder, value, onChange }) => (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input-field"
      />
    </div>
  );

export default PopUpInput