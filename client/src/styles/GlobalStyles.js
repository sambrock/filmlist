import { createGlobalStyle } from 'styled-components';
import Color from 'color';

import './tailwind.css';
import { breakpoints } from './mixins';

const primary = '#F2A20C';

const GlobalStyle = createGlobalStyle`
  :root {
    --black: #0a0a0a;
    --white: #f4f0f0;
    --primary: ${primary};
    --red: #ed4337;
    --grey: #2a2a2a;
    --opacity-1: rgba(242, 242, 242, .4);
    --opacity-2: rgba(242, 242, 242, .7);
    --opacity-3: rgba(242, 242, 242, .04);
    --opacity-4: rgba(242, 242, 242, .1);
    --opacity-5: rgba(0, 0, 0, .7);
    --opacity-primary: ${Color(primary).alpha(0.5)};
    --font-sans: 'Barlow', sans-serif;
    --fz-xxs: 10px;
    --fz-xs: 12px;
    --fz-sm: 14px;
    --fz-md: 16px;
    --fz-lg: 18px;
    --fz-xl: 20px;
    --fz-xxl: 28px;
    --fz-heading: clamp(2.7rem, 4vw, 3.3rem); 
    --fz-main: clamp(2.7rem, 10vw, 9rem); 
    --easing: cubic-bezier(0.43, 0.13, 0.23, 0.96);
    --transition: all 0.25s cubic-bezier(0.43, 0.13, 0.23, 0.96);
  }

  html {
    box-sizing: border-box;
    width: 100%;
    scrollbar-width: none;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: var(--black);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--opacity-1);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--opacity-2);
  }

::-moz-selection {
    background: var(--primary);
    color: var(--black);
  }

  ::selection {
    background: var(--primary);
    color: var(--black);
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    margin: 0;
    width: 100%;
    min-height: 100%;
    overflow-x: hidden;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    color: var(--white);
    font-family: var(--font-sans);
    font-size: var(--fz-md);
    font-weight: 400;
    /* letter-spacing: 0.01071em; */
    line-height: 1.3;
    background: var(--black);
  }

  a {
    color: var(--white);
    text-decoration: none;
  }

  h1 {
    /* line-height: 3.4rem; */
    padding: 0;
    margin: 0;
  }

  input {
    background: none;
    font-family: var(--font-sans);
    border: none;
    outline: none;
    padding: 14px 12px;

    &:focus {
      outline: none;
    }

    &::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: var(--opacity-1);
      opacity: 1; /* Firefox */
    }

    &:-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: var(--opacity-1);
    }

    &::-ms-input-placeholder { /* Microsoft Edge */
      color: var(--opacity-1);
    }
  }

  .fc {
    background: var(--opacity-3);
    padding: 14px 12px;
    transition: var(--transition);
    color: var(--white);
    font-size: var(--fz-md);
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--white);
    font-family: var(--font-sans);
    
    &:focus {
      outline: none;
    }
  }

  hr {
    border-color: var(--grey);
  }

  .border-primary {
    border: 1px var(--primary) solid;
  }

  .border-grey {
    border: 1px var(--opacity-4) solid;
  }
  
  .border-bottom-default {
    border-bottom: 1px var(--grey) solid;
  }

  .margin-movie-item-default {
    margin-left: 6vw;
    @media (max-width: ${breakpoints.lg}) { margin-left: 5px; }
  }

  .padding-movie-item-default {
    top: 6rem !important;
  }

  .scale-default {
    transform: scale(1.1);
  }

  .filter {
    filter: brightness(60%) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a' x='0' y='0' width='1' height='1'%3E%3CfeGaussianBlur stdDeviation='#{$radius}' result='b'/%3E%3CfeMorphology operator='dilate' radius='#{$radius}'/%3E %3CfeMerge%3E%3CfeMergeNode/%3E%3CfeMergeNode in='b'/%3E%3C/feMerge%3E%3C/filter%3E%3C/svg%3E#a");
  }

  .default-border {
    border: 1px dashed var(--opacity-1);
  }

  .barlowcondensed {
    font-family: 'Barlow Semi Condensed', sans-serif;
  }
  
  .khand {
    font-family: 'Khand', sans-serif;
  }

  .border-red {
    border: 1px red solid;
  }

  .border-orange {
    border: 1px var(--primary) solid;
    transition: var(--transition);
  }

  .blur {
    filter: brightness(50%) blur(2px);
    /* filter: brightness(60%) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a' x='0' y='0' width='1' height='1'%3E%3CfeGaussianBlur stdDeviation='#{$radius}' result='b'/%3E%3CfeMorphology operator='dilate' radius='#{$radius}'/%3E %3CfeMerge%3E%3CfeMergeNode/%3E%3CfeMergeNode in='b'/%3E%3C/feMerge%3E%3C/filter%3E%3C/svg%3E#a"); */
    /* background: var(--black); */
  }

  .absolute-horizontal-center {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0%);
  }

  .absolute-center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
  }

  .border-primary-opacity {
    border: 1px var(--opacity-primary) solid;
  }

  .border-transparent {
    border: 1px transparent solid;
  }

  .border-opacity {
    border: 1px var(--opacity-1) solid;
  }

  .border-default {
  border: 1.2px var(--grey) dashed;
  }

  .z-100 {
    z-index: 100;
  }

  .transition {
    transition: var(--transition);
  }

  .border-default-bottom {
    border-bottom: 1px var(--grey) solid;
  }

  .line-height-full {
    line-height: 100%;
  }

  .border-blue {
    border: 1px blue solid;
  }

  .fancy-font {
    font-family: 'Domine', serif;  
  }
  
  .border-red {
    border: 1px red solid;
  }

  .ratio {
    aspect-ratio: 1/1.5;
  }

  
`;

export default GlobalStyle;
