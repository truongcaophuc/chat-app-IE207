import { Stack, Box, Divider, Chip } from "@mui/material";
import React, { useEffect, useRef,useState } from "react";
import { useTheme } from "@mui/material/styles";
import { SimpleBarStyle } from "../../components/Scrollbar";
import { format, parseISO } from "date-fns";
import { ChatHeader, ChatFooter } from "../../components/Chat";
import useResponsive from "../../hooks/useResponsive";
import { Chat_History } from "../../data";
import {
  DocMsg,
  LinkMsg,
  MediaMsg,
  ReplyMsg,
  TextMsg,
  Timeline,
} from "../../sections/dashboard/Conversation";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchCurrentMessages,
  SetCurrentConversation,
} from "../../redux/slices/conversation";
import { socket } from "../../socket";
const groupMessagesByDate = (messages) => {
  console.log("thời gian là",messages)
  if (messages)
    return messages.reduce((groups, message) => {
      const date = format(parseISO(message.created_at), "yyyy-MM-dd"); // Lấy ngày từ timestamp
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
};
const Conversation = ({ isMobile, menu, messageRefs,method }) => {
  const dispatch = useDispatch();
  const { conversations, current_messages, current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const { room_id } = useSelector((state) => state.app);
  const groupedMessages = groupMessagesByDate(current_messages || []);

  useEffect(() => {
    const current = conversations.find((el) => el?.id === room_id);

    socket.emit("get_messages", { conversation_id: current?.id }, (data) => {
      // data => list of messages
      console.log(data, "List of messages");
      dispatch(FetchCurrentMessages({ messages: data }));
    });

    dispatch(SetCurrentConversation(current));
  }, [room_id]);
  return (
    current_conversation && (
      <Box p={isMobile ? 1 : 3} >
        <Stack spacing={3}>
          {Object.keys(groupedMessages).map((date) => (
            <div>
              <Stack spacing={1}>
                <Divider textAlign="center">
                  <Chip
                    label={format(parseISO(date), "dd/MM/yyyy")}
                    size="small"
                  />
                </Divider>
                {groupedMessages[date].map((el, index) => {
                  switch (el.type) {
                    // case "divider":
                    //   return (
                    //     // Timeline
                    //     <Timeline el={el} index={index} messageRefs={messageRefs}/>
                    //   );
                    case "msg":
                      switch (el.subtype) {
                        case "Text":
                          return (
                            // Doc Message
                            <TextMsg
                              el={el}
                              menu={menu}
                              index={index}
                              messageRefs={messageRefs}
                              method={method}
                            />
                          );
                        case "Link":
                          return (
                            //  Link Message
                            <LinkMsg
                              el={el}
                              menu={menu}
                              index={index}
                              messageRefs={messageRefs}
                              method={method}
                            />
                          );
                        case "Reply":
                          return (
                            //  ReplyMessage
                            <ReplyMsg
                              el={el}
                              menu={menu}
                              index={index}
                              messageRefs={messageRefs}
                              method={method}
                            />
                          );
                        default:
                          return (
                            // Text Message
                            <MediaMsg
                              el={el}
                              menu={menu}
                              index={index}
                              messageRefs={messageRefs}
                              method={method}
                            />
                          );
                      }
                    default:
                      return <></>;
                  }
                })}
              </Stack>
            </div>
          ))}
        </Stack>
      </Box>
    )
  );
};

const ChatComponent = ({ messageRefs, setShowSearchBar }) => {
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const theme = useTheme();
  const [replyTo, setReplyTo] = useState(null);
  const messageListRef = useRef(null);

  const { current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const handleReply = (message) => {
    setReplyTo(message); // Gán tin nhắn được trả lời
  };
  const clearReply = () => {
    setReplyTo(null); // Hủy tin nhắn trả lời
  };
  useEffect(() => {
    // Scroll to the bottom of the message list when new messages are added
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [current_messages]);

  return (
    <Stack
      height={"100%"}
      maxHeight={"100vh"}
      width={isMobile ? "100vw" : "auto"}
    >
      {/*  */}
      <ChatHeader setShowSearchBar={setShowSearchBar} />
      <Box
        ref={messageListRef}
        width={"100%"}
        sx={{
          position: "relative",
          flexGrow: 1,
          overflowY: "scroll",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F0F4FA"
              : theme.palette.background,

          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <SimpleBarStyle timeout={500} clickOnTrack={false}>
          <Conversation
            menu={true}
            isMobile={isMobile}
            messageRefs={messageRefs}

            method={{replyTo,handleReply}}
          />
        </SimpleBarStyle>
      </Box>

      {/*  */}
      <ChatFooter method={{replyTo,handleReply}}/>
    </Stack>
  );
};

export default ChatComponent;

export { Conversation };
