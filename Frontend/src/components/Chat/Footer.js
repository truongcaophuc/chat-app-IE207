import {
  Box,
  Fab,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Input,
} from "@mui/material";
import {
  Camera,
  File,
  Image,
  LinkSimple,
  PaperPlaneTilt,
  Smiley,
  Sticker,
  User,
} from "phosphor-react";
import { useTheme, styled } from "@mui/material/styles";
import React, { useRef, useState } from "react";
import useResponsive from "../../hooks/useResponsive";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  UpdateMessageStatus,
  AddDirectMessage,
  SortConversation,
  UpdateDirectConversation,
} from "../../redux/slices/conversation";
const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px !important",
    paddingBottom: "12px !important",
  },
}));

const Actions = [
  {
    color: "#0159b2",
    icon: <File size={24} />,
    title: "File",
  },
];

const ChatInput = ({
  openPicker,
  setOpenPicker,
  setValue,
  value,
  inputRef,
}) => {
  const dispatch = useDispatch();
  const { room_id } = useSelector((state) => state.app);
  const [openActions, setOpenActions] = React.useState(false);
  const fileInputRef = useRef(null); // Tham chiếu đến input file
  const user_id = window.localStorage.getItem("user_id");
  const { current_conversation, conversations } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const handleFileClick = () => {
    fileInputRef.current.click(); // Mở hộp thoại chọn file
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Lấy file được chọn
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = reader.result; // Nội dung file dưới dạng base64
  
        socket.emit("file_message", {
          conversation_id: current_conversation.id,
          from: user_id,
          to: current_conversation.user_id,
          file: {
            name: file.name,
            type: file.type,
            size: file.size,
            data: fileData, // Nội dung file
          },
        });
        dispatch(
          AddDirectMessage({
            message: {
              type: "msg",
              subtype: file.type,
              fileName:file.name,
              fileSize:file.size,
              fileData: fileData,
              incoming: false,
              outgoing: true,
            },
            conversation_id: room_id,
          })
        );
        dispatch(
          SortConversation({
            room_id,
          })
        );
        dispatch(
          UpdateDirectConversation({
            conversation: room_id,
            msg: { text: file.name },
          })
        );
        dispatch(
          UpdateMessageStatus({
            conversation_id: room_id,
            type: "Message sent",
          })
        );
      };
  
      reader.readAsDataURL(file); // Đọc file dưới dạng base64
    }
  };
  return (
    <StyledInput
      inputRef={inputRef}
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      fullWidth
      placeholder="Write a message..."
      variant="filled"
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <Stack sx={{ width: "max-content" }}>
            <Stack
              sx={{
                position: "absolute",
                flexDirection: "column",
                gap: "10px",
                bottom: "60px",
                display: openActions ? "flex" : "none",
              }}
            >
              {Actions.map((el, index) => (
                <Tooltip placement="right" title={el.title} key={index}>
                  <Fab
                    onClick={() => {
                      handleFileClick();
                      setOpenActions(!openActions);
                    }}
                    
                    sx={{
                      backgroundColor: el.color,
                    }}
                    aria-label="add"
                  >
                    {el.icon}
                  </Fab>
                </Tooltip>
              ))}
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }} // Ẩn input
                onChange={handleFileChange}
              />
            </Stack>

            <InputAdornment>
              <IconButton
                onClick={() => {
                  setOpenActions(!openActions);
                }}
              >
                <LinkSimple />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
        endAdornment: (
          <Stack sx={{ position: "relative" }}>
            <InputAdornment>
              <IconButton
                onClick={() => {
                  setOpenPicker(!openPicker);
                }}
              >
                <Smiley />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
      }}
    />
  );
};

function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    (url) => `<a href="${url}" target="_blank">${url}</a>`
  );
}

function containsUrl(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return urlRegex.test(text);
}

const Footer = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { current_conversation, conversations } = useSelector(
    (state) => state.conversation.direct_chat
  );

  const user_id = window.localStorage.getItem("user_id");

  const isMobile = useResponsive("between", "md", "xs", "sm");

  const { sideBar, room_id } = useSelector((state) => state.app);

  const [openPicker, setOpenPicker] = React.useState(false);

  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  function handleEmojiClick(emoji) {
    const input = inputRef.current;

    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      setValue(
        value.substring(0, selectionStart) +
          emoji +
          value.substring(selectionEnd)
      );

      // Move the cursor to the end of the inserted emoji
      input.selectionStart = input.selectionEnd = selectionStart + 1;
    }
  }

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "transparent !important",
      }}
    >
      <Box
        p={isMobile ? 1 : 2}
        width={"100%"}
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Stack direction="row" alignItems={"center"} spacing={isMobile ? 1 : 3}>
          <Stack sx={{ width: "100%" }}>
            <Box
              style={{
                zIndex: 10,
                position: "fixed",
                display: openPicker ? "inline" : "none",
                bottom: 81,
                right: isMobile ? 20 : sideBar.open ? 420 : 100,
              }}
            >
              <Picker
                theme={theme.palette.mode}
                data={data}
                onEmojiSelect={(emoji) => {
                  handleEmojiClick(emoji.native);
                }}
              />
            </Box>
            {/* Chat Input */}
            <ChatInput
              inputRef={inputRef}
              value={value}
              setValue={setValue}
              openPicker={openPicker}
              setOpenPicker={setOpenPicker}
            />
          </Stack>
          <Box
            sx={{
              height: 48,
              width: 48,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 1.5,
            }}
          >
            <Stack
              sx={{ height: "100%" }}
              alignItems={"center"}
              justifyContent="center"
            >
              <IconButton
                onClick={() => {
                  if (value) {
                    socket.emit("text_message", {
                      message: linkify(value),
                      conversation_id: room_id,
                      from: user_id,
                      to: current_conversation.user_id,
                      type: containsUrl(value) ? "Link" : "Text",
                    });
                    dispatch(
                      AddDirectMessage({
                        message: {
                          type: "msg",
                          subtype: containsUrl(value) ? "Link" : "Text",
                          message: linkify(value),
                          incoming: false,
                          outgoing: true,
                        },
                        conversation_id: room_id,
                      })
                    );
                    dispatch(
                      SortConversation({
                        room_id,
                      })
                    );
                    dispatch(
                      UpdateDirectConversation({
                        conversation: room_id,
                        msg: { text: value },
                      })
                    );
                    dispatch(
                      UpdateMessageStatus({
                        conversation_id: room_id,
                        type: "Message sent",
                      })
                    );
                    setValue("");
                  }
                }}
              >
                <PaperPlaneTilt color="#ffffff" />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;
