import React from "react";
import Chats from "./Chats";
import { Box, Stack } from "@mui/material";
import Conversation from "../../components/Conversation";

const GeneralApp = () => {
  return (
    <Stack direction={"row"} sx={{ width: "100%" }}>
      {/* Chats */}
      <Chats />

      <Box
        sx={{
          height: "100%",
          width: "calc(100vh-420px)",
          backgroundColor: "#fff",
        }}
      >
        {/* Conversation */}
        <Conversation />
      </Box>
    </Stack>
  );
};

export default GeneralApp;
