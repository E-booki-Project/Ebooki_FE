import React, { useState } from "react";
import * as SC from "../styles/components/SideCommentStyle";

import tape_pink from "../assets/images/tape_pink.png";
import tape_green from "../assets/images/tape_green.png";
import tape_yellow from "../assets/images/tape_yellow.png";
import tape_blue from "../assets/images/tape_blue.png";

import user_pink from "../assets/images/user_pink.png";
import user_green from "../assets/images/user_green.png";
import user_yellow from "../assets/images/user_yellow.png";
import user_blue from "../assets/images/user_blue.png";

import more from "../assets/images/morehorizontal.png";
import smile_grey from "../assets/images/smile_grey.png";
import smile_coral from "../assets/images/smile_coral.png";
import thumbsup_grey from "../assets/images/thumbsup_grey.png";
import thumbsup_coral from "../assets/images/thumbsup_coral.png";
import enter from "../assets/images/enter.png";

function SideComment() {
    const [smileActive, setSmileActive] = useState(false);
    const [thumbActive, setThumbActive] = useState(false);
    return (
        <SC.SideComment>
            <SC.Tape src={tape_pink} />
            <SC.Content>
                <SC.BookQuotes>
                    <span className="highlight">
                        아마 곁에 다른 사람이 여럿이 있으니까 말하기가
                        거북했을지도 모른다.
                    </span>
                </SC.BookQuotes>
                <SC.CommentContainer>
                    <SC.CommentHeader>
                        <SC.Profile>
                            <SC.ProfileIcon src={user_pink} />
                            <SC.ProfileName>닉네임</SC.ProfileName>
                        </SC.Profile>
                        <SC.MoreIcon src={more} />
                    </SC.CommentHeader>
                    <SC.CommentText>
                        나에게도 다소 책임이 있을는지 모른다.
                    </SC.CommentText>
                    <SC.CommentReaction>
                        <SC.ReactionWrapper
                            onClick={() => setSmileActive((prev) => !prev)}
                        >
                            <SC.ReactionIcon
                                src={smileActive ? smile_coral : smile_grey}
                            />
                            <SC.ReactionCount $active={smileActive}>
                                2
                            </SC.ReactionCount>
                        </SC.ReactionWrapper>
                        <SC.ReactionWrapper
                            onClick={() => setThumbActive((prev) => !prev)}
                        >
                            <SC.ReactionIcon
                                src={
                                    thumbActive ? thumbsup_coral : thumbsup_grey
                                }
                            />
                            <SC.ReactionCount $active={thumbActive}>
                                2
                            </SC.ReactionCount>
                        </SC.ReactionWrapper>
                    </SC.CommentReaction>
                </SC.CommentContainer>
            </SC.Content>
            <SC.InputWrapper>
                <SC.Input placeholder="답글 추가" />
                <SC.EnterIcon src={enter} />
            </SC.InputWrapper>
        </SC.SideComment>
    );
}

export default SideComment;
