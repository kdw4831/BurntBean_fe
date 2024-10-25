import React from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useGroup } from '../contexts/GroupContext';
import { useMember } from '../contexts/MemberContext';

const VideoConference = () => {
    const {groupName,id} = useGroup()
    const {nick} = useMember()
    

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <JitsiMeeting
                domain="jitsi.burntbean.site"
                roomName={`${groupName}__${id}`}
                configOverwrite={{
                    startWithAudioMuted: true,
                    startWithVideoMuted: true,
                    disableThirdPartyRequests: true,
                    prejoinPageEnabled: false,
                    enableWelcomePage: false,  // 환영 페이지 비활성화
                    closeMeetingContainer: true,
                    
                }}
                interfaceConfigOverwrite={{
                    SHOW_JITSI_WATERMARK: false, // Jitsi 로고 숨기기
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    HIDE_INVITE_MORE_HEADER: true,
                    SHOW_CHROME_EXTENSION_BANNER: false,
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    TOOLBAR_BUTTONS: ["microphone","camera","desktop","raisehand","hangup"],
                    SHOW_BRAND_WATERMARK:false,
                    
                }}
                userInfo={{
                    displayName: nick,
                }}
                onApiReady={(externalApi) => {
                    externalApi.executeCommand('displayName', nick);
                    externalApi.addListener('readyToClose', () => {
                        window.close(); // 탭 닫기
                    });
                }}
                getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = '100%';
                }}
            />
        </div>
    );
};

export default VideoConference;
