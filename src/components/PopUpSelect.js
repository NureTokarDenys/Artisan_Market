import './PopUpSelect.css';

const PopUpSelect = ({ value, onChange }) => (
    <div className="input-group">
      <label className="input-label">Select role</label>
      <select value={value} onChange={onChange} className="input-field">
        <option value="">Select role</option>
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
      </select>
    </div>
  );

export default PopUpSelect