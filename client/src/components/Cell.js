import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { areEqual } from 'react-window';
import slugify from 'slugify';
import styled from 'styled-components';
import { PageContext } from '../App';

import MovieInfo from './MovieInfo';
import MovieItem from './MovieItem';

const StyledCell = styled.div`
  ${(props) => ({ ...props.reactWindowStyles })};
  top: ${(props) => parseInt(props.reactWindowStyles.top) + 90}px;
`;

const Cell = memo(({ columnIndex, data, isScrolling, rowIndex, style, columns, page, showButtons }) => {
  const index = rowIndex * columns + columnIndex;
  const movie = data[index];

  if (index >= data.length)
    return (
      <div className="margin-movie-item-default" style={{ ...style, top: style.top + 90 }}>
        <div className="block mx-2 my-2 overflow-hidden relative bg-opacity-3"></div>
      </div>
    );

  return (
    <StyledCell reactWindowStyles={style} className="margin-movie-item-default">
      <Link className="flex flex-col" to={`/movie/${movie.id}-${slugify(movie.title, { lower: true, remove: /[*+~.()'"!:@]/g })}`}>
        <MovieItem key={index} movie={movie} showButtons={true} page={page} showButtons={showButtons} />
        <MovieInfo movie={movie} page={page} />
      </Link>
    </StyledCell>
  );
}, areEqual);

const CellContainer = (props) => (
  <PageContext.Consumer>
    {(values) => <Cell {...props} {...values}/>}
  </PageContext.Consumer>
);

export default CellContainer;
