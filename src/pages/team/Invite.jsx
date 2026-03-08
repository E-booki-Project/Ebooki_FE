import React from "react";
import * as I from "../../styles/team/InviteStyle";

import X from "../../assets/images/X.png";
import book from "../../assets/images/book.png";
import linkCoral from "../../assets/images/link_coral.png";
import userPink from "../../assets/images/user_pink.png";
import userBlue from "../../assets/images/user_blue.png";
import userGreen from "../../assets/images/user_green.png";
import more from "../../assets/images/more.png";

function Invite() {
    return (
        <I.Invite>
            <I.InviteContainer>
                <I.InviteHeader>
                    <I.BackIcon src={X} />
                </I.InviteHeader>
                <I.BookWrapper>
                    <I.Book src={book} />
                    <I.BookDesc>가을, 김유정</I.BookDesc>
                </I.BookWrapper>
                <I.InputWrapeer>
                    <I.InputFeild placeholder="팀 이름을 입력해주세요" />
                    <I.BackIcon
                        src={X}
                        style={{ width: "16px", height: "16px" }}
                    />
                </I.InputWrapeer>
                <I.LinkContainer>
                    <I.LinkWrapper>
                        <I.LinkIcon src={linkCoral} />
                        <I.LinkContent>
                            <I.LinkTitle>
                                Shareable Link is now ready!
                            </I.LinkTitle>
                            <I.LinkSub>
                                링크를 생성하고 친구랑 같이 읽어 보세요.
                            </I.LinkSub>
                        </I.LinkContent>
                    </I.LinkWrapper>
                    <I.LinkButton>Copy Link</I.LinkButton>
                </I.LinkContainer>
                <I.ListContainer>
                    <I.ListWrapper>
                        <I.ListContent>
                            <I.Profile src={userPink} />
                            <I.Username>user name</I.Username>
                        </I.ListContent>
                        <I.More src={more} />
                    </I.ListWrapper>
                    <I.ListWrapper>
                        <I.ListContent>
                            <I.Profile src={userBlue} />
                            <I.Username>user name</I.Username>
                        </I.ListContent>
                        <I.More src={more} />
                    </I.ListWrapper>
                    <I.ListWrapper>
                        <I.ListContent>
                            <I.Profile src={userGreen} />
                            <I.Username>user name</I.Username>
                        </I.ListContent>
                        <I.More src={more} />
                    </I.ListWrapper>
                </I.ListContainer>
            </I.InviteContainer>
        </I.Invite>
    );
}

export default Invite;
