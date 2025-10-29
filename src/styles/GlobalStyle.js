import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    font-family: "NanumGothic";
    overflow-x: hidden;
    min-height: 100vh;
    background-color: #F2F2F2;
    color: #1E1E1E;
  }

  @supports (-webkit-touch-callout: none) {
    body {
      min-height: -webkit-fill-available;
    }
  }

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  p {
    margin: 0;
  }
`;

export default GlobalStyle;
