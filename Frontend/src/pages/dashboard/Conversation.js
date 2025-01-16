import { Stack, Box, Divider, Chip } from "@mui/material";
import React, { useEffect, useRef } from "react";
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
const Conversation = ({ isMobile, menu, messageRefs }) => {
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
      <Box
        p={isMobile ? 1 : 3}
        style={{ position: "relative", minHeight: "100vh" }}
      >
        <Stack spacing={3}>
          {Object.keys(groupedMessages).map((date) => (
            <div style={{ minHeight: "500px" }}>
              <Stack spacing={1}>
                <Divider
                  textAlign="center"
                  style={{
                    padding: "20px",
                    position: "sticky",
                    top: "100px",
                    zIndex: 1,
                  }}
                >
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
                            />
                          );
                        case "reply":
                          return (
                            //  ReplyMessage
                            <ReplyMsg
                              el={el}
                              menu={menu}
                              index={index}
                              messageRefs={messageRefs}
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

  const messageListRef = useRef(null);

  const { current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );

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
          overflow: "scroll",

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
          />
        </SimpleBarStyle>
      </Box>

      {/*  */}
      <ChatFooter />
    </Stack>
  );
};

export default ChatComponent;

export { Conversation };
