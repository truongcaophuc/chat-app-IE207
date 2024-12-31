import React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

// Hàm tạo ID ngẫu nhiên
function randomID(len) {
  let result = '';
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length;
  len = len || 5;
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

// Hàm lấy token từ server
function generateToken(tokenServerUrl, appID, userID) {
  return fetch(tokenServerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_id: appID,
      user_id: userID,
    }),
  }).then(async (res) => {
    const result = await res.text();
    return result;
  });
}

// Hàm lấy tham số từ URL
function getUrlParams(url = window.location.href) {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

// Component chính
export default function App() {
  const roomID = getUrlParams().get('roomID') || randomID(5);
  const userID = randomID(5);
  const userName = randomID(5);

  const myMeeting = async (element) => {
    if (!element) return;

    // Lấy token từ server
    const token = await generateToken(
      'https://preview-uikit-server.zegotech.cn/api/token',
      2013980891,
      userID
    );

    // Tạo token sử dụng ZEGOCLOUD SDK
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      2013980891,
      token,
      roomID,
      userID,
      userName
    );

    // Tạo instance và tham gia phòng họp
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: element,
      showPreJoinView: false,
      sharedLinks: [
        {
          name: 'Personal link',
          url:
            window.location.origin +
            window.location.pathname +
            '?roomID=' +
            roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // Sử dụng GroupCall. Để gọi 1-1, thay bằng OneONoneCall.
      },
    });
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}
