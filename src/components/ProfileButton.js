import './ProfileButton.css';
import { useState } from "react";

const ProfileButton = ({ 
  className = "ProfileBtn",
  title = "Button",
  border = "none", 
  textColor = "#000",
  bgColor = "#efefef", 
  hoverColor = "#d3d3d3",
  hoverTextColor = textColor,
  action 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      style={{
        backgroundColor: isHovered ? hoverColor : bgColor,
        color: isHovered ? hoverTextColor : textColor,
        border: border
      }}
      className={className}
      onClick={action}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {title}
    </button>
  );
};

export default ProfileButton;