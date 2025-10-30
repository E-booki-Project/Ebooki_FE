import React from "react";
import * as I from "../../styles/team/InviteStyle";

function Invite() {
    return (
        <I.Invite>
            <I.InviteContainer>
                <I.InviteHeader>
                    <I.BackIcon />
                </I.InviteHeader>
                <I.BookWrapper>
                    <I.Book />
                    <I.BookDesc>가을, 김유정</I.BookDesc>
                </I.BookWrapper>
                <I.InputWrapeer>
                    <I.InputFeild placeholder="팀 이름을 입력해주세요" />
                    <I.BackIcon />
                </I.InputWrapeer>
                <I.LinkContainer>
                    <I.LinkWrapper>
                        <I.LinkIcon />
                        <I.LinkTitle>Shareable Link is now ready!</I.LinkTitle>
                        <I.LinkSub>
                            링크를 생성하고 친구랑 같이 읽어 보세요.
                        </I.LinkSub>
                    </I.LinkWrapper>
                    <I.LinkButton>Copy Link</I.LinkButton>
                </I.LinkContainer>
                <I.ListContainer>
                    <I.ListWrapper>
                        <I.Profile />
                        <I.Username>user name</I.Username>
                    </I.ListWrapper>
                    <I.More />
                </I.ListContainer>
            </I.InviteContainer>
        </I.Invite>
    );
}

export default Invite;
