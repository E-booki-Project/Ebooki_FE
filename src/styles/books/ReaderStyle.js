import styled from "styled-components";

export const Reader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 32px;
`;

export const SideSection = styled.div`
    position: relative;
    width: 240px;
    flex-shrink: 0;
    margin-top: -280px;
    z-index: 20;
`;

export const CenterSection = styled.div`
    flex: 0 0 auto;
    width: 700px;
    height: 516px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 14px;
`;

export const BookFrame = styled.div`
    width: 700px;
    height: 516px;
    position: relative;
    overflow: hidden;
    z-index: 1;
`;
