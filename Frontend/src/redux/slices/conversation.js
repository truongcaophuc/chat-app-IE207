import { createSlice } from "@reduxjs/toolkit";
import { faker } from "@faker-js/faker";
import { AWS_S3_REGION, S3_BUCKET_NAME } from "../../config";
import { format, isThisYear, isToday, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
const user_id = window.localStorage.getItem("user_id");
const getMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  const daysDifference = Math.floor(
    (new Date() - date) / (1000 * 60 * 60 * 24)
  );
  if (daysDifference < 7) {
    let result = formatDistanceToNow(date, {
      addSuffix: false,
      locale: vi,
    }).replace(/^khoảng /, "");
    if (result === "dưới 1 phút") {
      return "Vài giây";
    }
    return result;
  } else {
    if (isThisYear(date)) {
      // Nếu cùng năm, hiển thị ngày và tháng
      return format(date, "dd/MM");
    } else {
      // Nếu năm khác, hiển thị ngày, tháng và năm với 2 chữ số cuối
      return format(date, "dd/MM/yy");
    }
  }
};
const initialState = {
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
  group_chat: {},
};

const slice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    fetchDirectConversations(state, action) {
      const sort_message = action.payload.conversations?.sort(
        (a, b) =>
          new Date(b.messages.slice(-1)[0].created_at) -
          new Date(a.messages.slice(-1)[0].created_at)
      ); // Sắp xếp theo thời gian giảm dần
      const list = sort_message.map((el) => {
        const user = el.participants.find(
          (elm) => elm._id.toString() !== user_id
        );
        const time = getMessageTime(
          el.messages[el.messages.length - 1].created_at
        );
        return {
          id: el._id,
          user_id: user?._id,
          name: `${user?.firstName} ${user?.lastName}`,
          online: user?.status === "Online",
          img: `https://gravatar.com/avatar/2a4edd140c41ba256d49c56e45883c99?s=400&d=robohash&r=x`,
          msg: el.messages.slice(-1)[0].text,
          time: time,
          unread: 0,
          pinned: false,
          about: user?.about,
        };
      });

      state.direct_chat.conversations = list;
    },
    updateDirectConversation(state, action) {
      const { conversation, msg, room_id } = action.payload;
      const this_conversation_id = conversation || room_id;
      state.direct_chat.conversations.forEach((conversation) => {
        if (conversation?.id === this_conversation_id) {
          console.log("có so sánh");
          if (conversation) {
            conversation.time = `Vài giây`;
          }
          if (msg) conversation.msg = msg.text;
          if (room_id && this_conversation_id === room_id) {
            console.log("cập nhật về 0");
            conversation.unread = 0;
          } else conversation.unread += 1;
        } else console.log("khong co ai bang");
      });
    },
    addDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      const user = this_conversation.participants.find(
        (elm) => elm._id.toString() !== user_id
      );
      state.direct_chat.conversations = state.direct_chat.conversations.filter(
        (el) => el?.id !== this_conversation._id
      );
      state.direct_chat.conversations.push({
        id: this_conversation._id._id,
        user_id: user?._id,
        name: `${user?.firstName} ${user?.lastName}`,
        online: user?.status === "Online",
        img: faker.image.avatar(),
        msg: faker.music.songName(),
        time: "9:36",
        unread: 0,
        pinned: false,
      });
    },
    setCurrentConversation(state, action) {
      state.direct_chat.current_conversation = action.payload;
    },
    fetchCurrentMessages(state, action) {
      const messages = action.payload.messages;
      const formatted_messages = messages.map((el) => ({
        id: el._id,
        type: "msg",
        subtype: el.type,
        message: el.text,
        incoming: el.to === user_id,
        outgoing: el.from === user_id,
      }));
      state.direct_chat.current_messages = formatted_messages;
    },
    addDirectMessage(state, action) {
      console.log("Tôi đang cập nhạt tin nhắn vào cuộc hội thoại");
      state.direct_chat.current_messages.push(action.payload.message);
    },
    updateUserStatus(state, action) {
      state.direct_chat.conversations.forEach((conversation) => {
        if (conversation.user_id === action.payload._id)
          conversation.online = action.payload.status === "Online";
      });
    },
    sortConversation(state, action) {
      const { room_id, conversations } = action.payload;
      console.log(room_id, conversations);
      const sorted_conversation = [
        ...conversations.filter((conversation) => conversation.id === room_id),
        ...conversations.filter((conversation) => conversation.id !== room_id),
      ];
      state.direct_chat.conversations = sorted_conversation;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const FetchDirectConversations = ({ conversations }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchDirectConversations({ conversations }));
  };
};
export const AddDirectConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectConversation({ conversation }));
  };
};
export const UpdateDirectConversation = ({ conversation, msg }) => {
  return async (dispatch, getState) => {
    const room_id = getState().app.room_id; // In ra state để kiểm tra hoặc sử dụng trong logic
    dispatch(
      slice.actions.updateDirectConversation({ conversation, msg, room_id })
    );
  };
};

export const SetCurrentConversation = (current_conversation) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setCurrentConversation(current_conversation));
  };
};

export const FetchCurrentMessages = ({ messages }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchCurrentMessages({ messages }));
  };
};

export const AddDirectMessage = ({ message, data }) => {
  return async (dispatch, getState) => {
    if(data.conversation_id===getState().app.room_id)
    dispatch(slice.actions.addDirectMessage({ message }));
  else console.log("Bạn đang không trong phòng họp")
  };
};
export const UpdateUserStatus = (user) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateUserStatus(user));
  };
};
export const SortConversation = (conversations, room_id) => {
  return async (dispatch, getState) => {
    console.log("đã sắp xếp");
    dispatch(slice.actions.sortConversation(getState().conversation.direct_chat.conversations, room_id));
  };
};
