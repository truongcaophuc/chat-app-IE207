import React from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Tabs,
  Tab,
  Divider
} from "@mui/material";
import { ArrowLeft, Image, FileVideo,Link } from "phosphor-react";
import useResponsive from "../../hooks/useResponsive";
import { useDispatch, useSelector } from "react-redux";
import { UpdateSidebarType } from "../../redux/slices/app";
import { faker } from "@faker-js/faker";
import { MediaMsg, LinkMsg } from "./Conversation";
import { Shared_docs, Shared_links } from "../../data";
const formatFileSize = (size) => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  while (size > 1024 && unitIndex < units.length) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};
const Media = () => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const { current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const isDesktop = useResponsive("up", "md");

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const mediaMsg = current_messages.filter((message) => {
    return (
      message.subtype.startsWith("image/") ||
      message.subtype.startsWith("video/")
    );
  });

  console.log("giá trị media msg là", mediaMsg);
  const linkMsg = current_messages.filter((message) => {
    return message.subtype === "Link";
  });
  return (
    <Box sx={{ width: !isDesktop ? "100vw" : 320, maxHeight: "100vh" }}>
      <Stack sx={{ height: "100%" }}>
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
          }}
        >
          <Stack
            sx={{ height: "100%", p: 2 }}
            direction="row"
            alignItems={"center"}
            spacing={3}
          >
            <IconButton
              onClick={() => {
                dispatch(UpdateSidebarType("CONTACT"));
              }}
            >
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle2">File</Typography>
          </Stack>
        </Box>

        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Media" />
          <Tab label="Links" />
        </Tabs>
        <Stack
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflow: "scroll",
          }}
          spacing={3}
          padding={value === 1 ? 1 : 3}
        >
          {(() => {
            switch (value) {
              case 0:
                return mediaMsg.map((el, index) => {
                  return (
                    <Stack>
                      <Stack
                        flexDirection={"row"}
                        gap="10px"
                        alignItems={"center"}
                      >
                        {el.subtype.startsWith("image/") ? (
                          <Image
                            size={48}
                            color={"#0088ff"}
                          />
                        ) : (
                          <FileVideo
                            size={48}
                            color={"#ff9b04"}
                          />
                        )}
                        <Stack sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            color={"black"}
                          >
                            {el.fileName}
                          </Typography>
                          <Typography
                            variant="body2"
                            color={"black"}
                          >
                            {formatFileSize(el.fileSize)}
                          </Typography>
                        </Stack>
                      </Stack>
                        <Divider/>
                    </Stack>
                  );
                });

              case 1:
                return linkMsg.map((el, index) => {
                  return (
                    <Stack direction="column" spacing={1}>
                      <Stack direction={"row"} spacing={2} style={{alignItems:"center"}}>
                      <Link
                          size={48}
                          color={"#12af00"}
                        />
                        <Typography
                          variant="body2"
                          color={"black"}
                          sx={{
                            "& a": {
                              color: "black",
                              textDecoration: "none",
                            },
                          }}
                        >
                          <div
                            dangerouslySetInnerHTML={{ __html: el.message }}
                          ></div>
                        </Typography>
                      </Stack>
                      <Divider/>
                    </Stack>
                  );
                });
              default:
                break;
            }
          })()}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Media;
