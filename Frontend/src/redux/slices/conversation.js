import { createSlice } from "@reduxjs/toolkit";
import { faker } from "@faker-js/faker";
import { AWS_S3_REGION, S3_BUCKET_NAME } from "../../config";
import { format, isThisYear, isToday, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { socket } from "../../socket";
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
  group_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
};

const slice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    fetchDirectConversations(state, action) {
      const sort_message = action.payload.conversations?.sort(
        (a, b) =>
          new Date(b.messages.slice(-1)[0]?.created_at) -
          new Date(a.messages.slice(-1)[0]?.created_at)
      ); // Sắp xếp theo thời gian giảm dần
      const list = sort_message.map((el) => {
        const user = el.participants.find(
          (elm) => elm._id.toString() !== user_id
        );
        const time =el.messages.length? getMessageTime(
          el.messages[el.messages.length - 1].created_at
        ):"";
        const unread_message_count = el.messages.filter(
          (message) => !message.is_read && message.to === user_id
        ).length;
        const not_seen_message_count = el.messages.filter(
          (message) => !message.is_read && message.to !== user_id
        ).length;
        return {
          id: el._id,
          user_id: user?._id,
          name: `${user?.firstName} ${user?.lastName}`,
          online: user?.status === "Online",
          img: `https://gravatar.com/avatar/2a4edd140c41ba256d49c56e45883c99?s=400&d=robohash&r=x`,
          msg: el.messages.slice(-1)[0]?.text ||"",
          time: time,
          unread: unread_message_count,
          pinned: false,
          about: user?.about,
          isSeen: not_seen_message_count ? false : true,
        };
      });

      state.direct_chat.conversations = list;
    },
    fetchGroupConversations(state, action) {
      const sort_message = action.payload.conversations?.sort(
        (a, b) =>
          new Date(b.messages.slice(-1)[0]?.created_at) -
          new Date(a.messages.slice(-1)[0]?.created_at)
      ); // Sắp xếp theo thời gian giảm dần
      const list = sort_message.map((el) => {
        const users = el.participants.filter(
          (elm) => elm._id.toString() !== user_id
        );
        const time =el.messages.length? getMessageTime(
          el.messages[el.messages.length - 1].created_at
        ):"";
        const unread_message_count = el.messages.filter(
          (message) => !message.is_read && message.to === user_id
        ).length;
        return {
          id: el._id,
          users:  el.participants,
          name: el.title,
          img: `https://gravatar.com/avatar/2a4edd140c41ba256d49c56e45883c99?s=400&d=robohash&r=x`,
          msg: el.messages.slice(-1)[0]?.text ||"",
          time: time,
          unread: unread_message_count,
          pinned: false,
        };
      });

      state.group_chat.conversations = list;
    },
    updateDirectConversation(state, action) {
      const { conversation, msg, room_id } = action.payload;
      const this_conversation_id = conversation || room_id;
      state.direct_chat.conversations.forEach((conversation) => {
        if (conversation.id === this_conversation_id) {
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
    updateGroupConversation(state, action) {
      const { conversation, msg, group_id } = action.payload;
      const this_conversation_id = conversation || group_id;
      state.group_chat.conversations.forEach((conversation) => {
        if (conversation.id === this_conversation_id) {
          console.log("có so sánh");
          if (conversation) {
            conversation.time = `Vài giây`;
          }
          if (msg) conversation.msg = msg.text;
          if (group_id && this_conversation_id === group_id) {
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
      state.direct_chat.conversations.push({
        id: this_conversation._id,
        user_id: user?._id,
        name: `${user?.firstName} ${user?.lastName}`,
        online: user?.status === "Online",
        img: faker.image.avatar(),
        msg: "",
        time: "",
        unread: 0,
        pinned: false,
      });
    },
    addGroupConversation(state, action) {
      const this_conversation = action.payload.group;
      console.log("nhóm mới",this_conversation)


      state.group_chat.conversations.push({
        id: this_conversation._id,
        users: this_conversation.participants,
        name: this_conversation.title,
        img: faker.image.avatar(),
        msg: "",
        time: "",
        unread: 0,
        pinned: false,
      });
    },
    setCurrentConversation(state, action) {
      state.direct_chat.current_conversation = action.payload;
    },
    setCurrentGroup(state, action) {
      state.group_chat.current_conversation = action.payload;
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
    fetchCurrentMessagesGroup(state, action) {
      const messages = action.payload.messages;
      const formatted_messages = messages.map((el) => ({
        id: el._id,
        type: "msg",
        subtype: el.type,
        message: el.text,
        incoming: el.from._id !== user_id,
        outgoing: el.from._id === user_id,
        from:el.from.firstName+" " + el.from.lastName
      }));
      state.group_chat.current_messages = formatted_messages;
    },
    addDirectMessage(state, action) {
      console.log("Tôi đang cập nhạt tin nhắn vào cuộc hội thoại");
      state.direct_chat.current_messages.push(action.payload.message);
    },
    addGroupMessage(state, action) {
      console.log("Tôi đang cập nhạt tin nhắn vào cuộc hội thoại");
      state.group_chat.current_messages.push(action.payload.message);
    },
    updateUserStatus(state, action) {
      state.direct_chat.conversations.forEach((conversation) => {
        if (conversation.user_id === action.payload._id)
          conversation.online = action.payload.status === "Online";
      });
    },
    updateMessageStatus(state, action) {
      console.log("tôi vàoo rồi");
      console.log(action.payload.conversation_id);
      const { type, conversation_id } = action.payload;
      state.direct_chat.conversations.forEach((conversation) => {
        if (conversation.id === conversation_id) {
          if (type === "Message viewed") conversation.unread = 0;
          if (type === "Notification of viewed messages") {
            conversation.isSeen = true;
          } else if (type === "Message sent") {
            conversation.isSeen = false;
          }
        }
      });
    },
    updateMessageGroupStatus(state, action) {
      console.log("tôi vàoo rồi");
      console.log(action.payload.conversation_id);
      const { type, conversation_id } = action.payload;
      state.group_chat.conversations.forEach((conversation) => {
        if (conversation.id === conversation_id) {
          if (type === "Message viewed") conversation.unread = 0;
          if (type === "Notification of viewed messages") {
            conversation.isSeen = true;
          } else if (type === "Message sent") {
            conversation.isSeen = false;
          }
        }
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
    sortConversationGroup(state, action) {
      const { room_id, conversations } = action.payload;
      console.log(room_id, conversations);
      const sorted_conversation = [
        ...conversations.filter((conversation) => conversation.id === room_id),
        ...conversations.filter((conversation) => conversation.id !== room_id),
      ];
      state.group_chat.conversations = sorted_conversation;
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
export const FetchGroupConversations = ({ conversations }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchGroupConversations({ conversations }));
  };
};
export const AddDirectConversation = ({ conversation }) => {
  console.log("cuộc trò chuyện mới", conversation)
  return async (dispatch, getState) => {
    const conversations=getState().conversation.direct_chat.conversations
    const existing_conversation = conversations.find(
      (c) => c.id === conversation._id
    );
    if (!existing_conversation) {
      dispatch(slice.actions.addDirectConversation({ conversation }));
    } else {
      console.log("Cuộc hội thoại đã tồn tại");
    }
  };
};
export const AddGroupConversation = ({ group }) => {
  return async (dispatch, getState) => {
   
      dispatch(slice.actions.addGroupConversation({ group }));

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
export const SetCurrentGroup = (current_conversation) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setCurrentGroup(current_conversation));
  };
};
export const FetchCurrentMessages = ({ messages }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchCurrentMessages({ messages }));
  };
};
export const FetchCurrentMessagesGroup = ({ messages }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchCurrentMessagesGroup({ messages }));
  };
};
export const AddDirectMessage = ({ message, conversation_id }) => {
  return async (dispatch, getState) => {
    if (conversation_id === getState().app.room_id) {
      console.log("đang thêm tin nhắn")
      socket.emit("message_seen", {
        conversation_id,
        from:  getState().conversation.direct_chat.current_conversation.user_id,
      });
      dispatch(slice.actions.addDirectMessage({ message }));
    } else console.log("Bạn đang không trong phòng họp");
  };
};
export const AddGroupMessage = ({ message, conversation_id }) => {
  return async (dispatch, getState) => {
    if (conversation_id === getState().app.group_id) {
      socket.emit("message_seen", {
        conversation_id,
        from:  getState().conversation.group_chat.current_conversation.user_id,
      });
      dispatch(slice.actions.addGroupMessage({ message }));
    } else console.log("Bạn đang không trong phòng họp");
  };
};
export const UpdateUserStatus = (user) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateUserStatus(user));
  };
};
export const SortConversation = ({ room_id }) => {
  return async (dispatch, getState) => {
    console.log("đã sắp xếp");
    dispatch(
      slice.actions.sortConversation({
        conversations: getState().conversation.direct_chat.conversations,
        room_id,
      })
    );
  };
};
export const SortConversationGroup = ({ room_id }) => {
  return async (dispatch, getState) => {
    console.log("đã sắp xếp");
    dispatch(
      slice.actions.sortConversationGroup({
        conversations: getState().conversation.group_chat.conversations,
        room_id,
      })
    );
  };
};
export const UpdateMessageStatus = ({ conversation_id, type }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateMessageStatus({ conversation_id, type }));
  };
};
export const UpdateMessageGroupStatus = ({ conversation_id, type }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateMessageGroupStatus({ conversation_id, type }));
  };
};
export const UpdateGroupConversation = ({ conversation, msg }) => {
  return async (dispatch, getState) => {
    const group_id = getState().app.group_id; // In ra state để kiểm tra hoặc sử dụng trong logic
    dispatch(
      slice.actions.updateGroupConversation({ conversation, msg, group_id })
    );
  };
};
