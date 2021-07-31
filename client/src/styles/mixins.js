import { css } from 'styled-components';

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1536px',
  xxxl: '1930px',
};

const mixins = {
  breakpoints,

  width: css`
    width: auto !important;
    @media (min-width: ${breakpoints.md}) { width: 88vw !important; }
  `,

  movieGrid: (cols) => css`
    max-width: 2400px;
    grid-template-columns: repeat(2, 1fr);
    @media (min-width: ${breakpoints.sm}) { grid-template-columns: repeat(3, 1fr); }
    @media (min-width: ${breakpoints.md}) { grid-template-columns: repeat(3, 1fr); }
    @media (min-width: ${breakpoints.lg}) { grid-template-columns: repeat(4, 1fr); }
    @media (min-width: ${breakpoints.xl}) { grid-template-columns: repeat(5, 1fr); }
    @media (min-width: ${breakpoints.xxl}) { grid-template-columns: repeat(${cols}, minmax(0, 1fr)); }
    @media (min-width: ${breakpoints.xxxl}) { grid-template-columns: repeat(${cols + 1}, minmax(0, 1fr)); }
  `,

  backdropTemplateGrid: css`
    grid-template-columns: 3fr 610px;
  
    @media (max-width: ${breakpoints.md}) { 
      grid-template-columns: 1fr;
      grid-template-rows: 40vh 1fr;
    }
  `,

  buttonSize: css`
    font-size: 2em;
    @media (min-width: ${breakpoints.md}) { font-size: 2.4em; }
  `,
}

export default mixins;