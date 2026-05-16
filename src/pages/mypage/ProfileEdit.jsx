import React, { useRef, useState, useEffect } from "react";
import * as PE from "../../styles/mypage/ProfileEditStyle";
import { getUserInfo, updateUserInfo } from "../../utils/authStorage";
import {
    getProfilePresignedUrl,
    uploadToS3,
    updateProfileImage,
    updateNickname,
    updatePassword,
} from "../../api/mypage";

import plus from "../../assets/images/plus_gray.png";
import defaultUser from "../../assets/images/user_blue.png";
import back from "../../assets/images/back.png";

function ProfileEdit({ onCancel, onSave }) {
    const fileRef = useRef(null);
    const userInfo = getUserInfo();

    const [previewUrl, setPreviewUrl] = useState(userInfo?.profileImage || defaultUser);
    const [newImageFile, setNewImageFile] = useState(null);
    const [nickname, setNickname] = useState(userInfo?.nickname ?? "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setNewImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword && newPassword !== passwordConfirm) {
            alert("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        setIsLoading(true);
        try {
            const updates = {};

            if (newImageFile) {
                const { presignedUrl, fileKey } = await getProfilePresignedUrl(
                    newImageFile.name,
                    newImageFile.type
                );
                await uploadToS3(presignedUrl, newImageFile);
                await updateProfileImage(fileKey);
                updates.profileImage = fileKey;
            }

            if (nickname !== (userInfo?.nickname ?? "")) {
                await updateNickname(nickname);
                updates.nickname = nickname;
            }

            if (newPassword) {
                await updatePassword(currentPassword, newPassword);
            }

            if (Object.keys(updates).length > 0) {
                updateUserInfo(updates);
            }

            onSave();
        } catch (error) {
            alert(error.response?.data?.message || "수정에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PE.ProfileEdit>
            <PE.Header>
                <img src={back} onClick={onCancel} alt="뒤로가기" />
            </PE.Header>
            <PE.ProfileWrapper type="button" onClick={() => fileRef.current.click()}>
                <PE.ProfileImg src={previewUrl} />
                <PE.ProfileIcon src={plus} />
            </PE.ProfileWrapper>
            <PE.ProfileInput
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={handleImageChange}
            />
            <PE.AccountSettings>
                <PE.Form onSubmit={handleSubmit}>
                    <PE.InputWrapper>
                        <PE.InputLabel>이메일</PE.InputLabel>
                        <PE.InputFeild
                            readOnly
                            value={userInfo?.email ?? ""}
                            style={{ border: "none", padding: "16px 0px" }}
                        />
                    </PE.InputWrapper>
                    <PE.InputWrapper>
                        <PE.InputLabel>닉네임</PE.InputLabel>
                        <PE.InputFeild
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="닉네임을 입력하세요"
                        />
                    </PE.InputWrapper>
                    <PE.InputWrapper>
                        <PE.InputLabel>현재 비밀번호</PE.InputLabel>
                        <PE.InputFeild
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="현재 비밀번호"
                        />
                    </PE.InputWrapper>
                    <PE.InputWrapper>
                        <PE.InputLabel>새 비밀번호</PE.InputLabel>
                        <PE.InputFeild
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                        />
                    </PE.InputWrapper>
                    <PE.InputWrapper>
                        <PE.InputLabel>비밀번호 확인</PE.InputLabel>
                        <PE.InputFeild
                            type="password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                        />
                    </PE.InputWrapper>
                    <PE.EditButton type="submit" disabled={isLoading}>
                        {isLoading ? "저장 중..." : "수정 완료"}
                    </PE.EditButton>
                </PE.Form>
                <PE.WithdrawButton type="button">회원 탈퇴</PE.WithdrawButton>
            </PE.AccountSettings>
        </PE.ProfileEdit>
    );
}

export default ProfileEdit;
