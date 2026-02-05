import styled from "styled-components";

export const Reader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    min-height: 90vh;
`;

export const SideSection = styled.div`
    position: relative;
    width: 240px;
    flex-shrink: 0;
    z-index: 20;
`;

export const CenterSection = styled.div`
    flex: 0 0 auto;
    width: clamp(700px, 55vw, 1050px);
    aspect-ratio: 700 / 516;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 14px;
`;

export const BookFrame = styled.div`
    width: clamp(700px, 55vw, 1050px);
    aspect-ratio: 700 / 516;
    position: relative;
    overflow: hidden;
    z-index: 1;
`;
