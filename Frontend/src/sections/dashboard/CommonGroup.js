import React from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Divider,
  Avatar as AvatarMUI,
} from "@mui/material";
import Avatar from "react-avatar";
import { ArrowLeft } from "phosphor-react";
import useResponsive from "../../hooks/useResponsive";
import { UpdateSidebarType } from "../../redux/slices/app";
import { faker } from "@faker-js/faker";
import { DocMsg, LinkMsg } from "./Conversation";
import { Shared_docs, Shared_links } from "../../data";
import { useDispatch, useSelector } from "react-redux";
const Media = () => {
  const dispatch = useDispatch();

  const theme = useTheme();

  const isDesktop = useResponsive("up", "md");

  const [value, setValue] = React.useState(0);

  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const { user_id } = useSelector((state) => state.auth);
  const { conversations } = useSelector(
    (state) => state.conversation.group_chat
  );
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const commonGroup = conversations.filter((conversation) => {
    return (
      conversation?.users.filter((user) => {
        return (
          user?._id == user_id || user?._id == current_conversation.user_id
        );
      }).length == 2
    );
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
            <Typography variant="subtitle2">Nhóm chung</Typography>
          </Stack>
        </Box>
        <Stack style={{ padding: "16px", gap: "16px" }}>
          {commonGroup.map((group) => {
            const maxDisplay = 4; // Số lượng avatar tối đa hiển thị
            const displayMembers = group?.users?.slice(0, maxDisplay);
            const extraCount = group?.users?.length - (maxDisplay - 1);
            return (
              <Stack >
                <Stack
                  flexDirection={"row"}
                  style={{ gap: "12px", alignItems: "center", padding: "8px"}}
                >
                  <Box sx={{ position: "relative", width: 45, height: 45 }}>
                    {displayMembers?.map((member, index) => (
                      <Avatar
                        key={index}
                        src={member.avatarUrl}
                        round
                        size="25"
                        style={{
                          position: "absolute",
                          ...(index === 0 && { top: 0, left: 0 }),
                          ...(index === 1 && { top: 0, right: 0 }),
                          ...(index === 2 && {
                            bottom: 0,
                            left: displayMembers.length === 3 ? 10 : 0,
                          }),
                          ...(index === 3 && { bottom: 0, right: 0 }),
                        }}
                        name={member.firstName + " " + member.lastName}
                      />
                    ))}
                    {extraCount > 1 && (
                      <AvatarMUI
                        sx={{
                          width: 25, // Kích thước chiều rộng
                          height: 25, // Kích thước chiều cao
                          fontSize: 14,
                          bottom: 0,
                          right: 0,
                          position: "absolute",
                        }}
                      >
                        +{extraCount}
                      </AvatarMUI>
                    )}
                  </Box>
                  <Typography>{group.name}</Typography>
                </Stack>
                <Divider/>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Media;
