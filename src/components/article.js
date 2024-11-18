import H1 from './h1';
import Paragraph from './paragraph';
import './article.css';

const Article = ({ header, paragraph, isList = false, isBoldWorded = false }) => {
  return (
    <article className="article">
      <H1 text={header} />
      {isList ? (
        <ul>
          {paragraph.map((item, index) => {
            if (isBoldWorded) {
              const [firstWord, ...rest] = item.split(':');
              return (
                <li key={index}>
                  <Paragraph
                    text={
                      <>
                        <strong>{firstWord}:</strong> {rest.join(':').trim()}
                      </>
                    }
                  />
                </li>
              );
            }
            return (
              <li key={index}>
                <Paragraph text={item} />
              </li>
            );
          })}
        </ul>
      ) : (
        <Paragraph text={paragraph} />
      )}
    </article>
  );
};

export default Article;
