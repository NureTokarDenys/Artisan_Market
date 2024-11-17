import './ProfileButton.css';
import { useState } from "react";

const ProfileButton = ({ 
  title = "Button", 
  textColor = "#000",
  bgColor = "#efefef", 
  hoverColor = "#d3d3d3", 
  action 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      style={{
        backgroundColor: isHovered ? hoverColor : bgColor,
        color: textColor
      }}
      className="ProfileBtn"
      onClick={action}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {title}
    </button>
  );
};

export default ProfileButton;