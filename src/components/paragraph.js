import './paragraph.css';

const Paragraph = ({ text, cursive = false }) => {
    return (
      <p className={`paragraph ${cursive ? 'cursive' : ''}`}>{text}</p>
    );
  };
  
  export default Paragraph;  