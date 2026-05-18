import styled from "styled-components";
import { typography } from "../typography";
import { colors } from "../colors";

export const Join = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
`;

export const JoinContainer = styled.div`
    width: 860px;
    background-color: ${colors.white};
    border: 1px solid ${colors.grayMedium};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    border-radius: 8px;
`;

export const BookWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
`;

export const Book = styled.img`
    width: 152px;
`;

export const BookDesc = styled.div`
    margin-top: 8px;
    ${typography.bodyBase};
`;

export const GroupContainer = styled.div`
    width: 216px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 24px;
    margin-bottom: 32px;
`;

export const Group = styled.div`
    display: flex;
    align-items: center;
`;

export const Profile = styled.img`
    width: 52px;
    height: 52px;
    &:not(:first-child) {
        margin-left: -8px; /* 겹치는 정도 조정 */
    }
`;

export const Plus = styled.img`
    width: 20px;
    height: 20px;
`;

export const JoinProfile = styled.img`
    width: 52px;
    height: 52px;
`;

export const JoinContent = styled.div`
    ${typography.subHeading}
`;

export const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 255px;
    height: 40px;
    margin-top: 16px;
`;

export const AcceptButton = styled.button`
    border: none;
    border-radius: 8px;
    background-color: ${colors.coral};
    width: 185px;
    height: 100%;
    padding: 12px;
    color: ${colors.white};
    ${typography.bodyBaseSingle}
`;

export const CancleButton = styled.button`
    border: 1px solid ${colors.grayDark};
    background-color: ${colors.white};
    border-radius: 8px;
    width: 54px;
    height: 100%;
    padding: 12px;
    color: ${colors.grayDark};
    ${typography.bodyBaseSingle}
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;
