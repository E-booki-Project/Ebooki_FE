import styled from "styled-components";
import { typography } from "../typography";
import { colors } from "../colors";

export const ProfileView = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 33px;
    width: 100%;
    height: 100%;
`;

export const EditButton = styled.button`
    align-self: flex-end;
    border: 1px solid ${colors.grayMedium};
    border-radius: 8px;
    box-sizing: border-box;
    padding: 8px;
    ${typography.bodyBaseSingle}
    display: flex;
    align-items: center;
    text-align: center;
    background-color: ${colors.white};
    text-align: center;
`;

export const EditIcon = styled.img`
    width: 16px;
    height: 16px;
    margin-right: 8px;
`;

export const Profile = styled.div`
    margin-top: 113px;
    margin-bottom: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const ProfileIcon = styled.img`
    width: 216px;
    height: 216px;
    margin-bottom: 16px;
`;

export const ProfileName = styled.div`
    ${typography.Heading};
    font-size: 24px;
`;

export const Book = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${colors.white};
    padding: 24px;
    border-radius: 8px;
    width: 453px;
    display: block;
    box-shadow: 0px 1px 9.7px rgba(0, 0, 0, 0.1);
    position: relative;
`;

export const BookTape = styled.img`
    width: 81.96px;
    position: absolute;
    top: -22px;
    left: calc(50% - 40.98px);
`;

export const BookContent = styled.div`
    ${typography.bodySmall};
    font-size: 13px;
    white-space: pre-wrap;
    color: ${colors.black};
    display: inline;
    padding: 0 2px;
    box-shadow: inset 0 -1.1em 0 rgba(137, 209, 217, 0.3);
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
`;

export const BookInfo = styled.div`
    margin-top: 12px;
    ${typography.bodySmall};
    font-size: 13px;
    color: ${colors.black};
`;
