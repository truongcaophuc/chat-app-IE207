import { Box, Stack } from "@mui/material";
import React from "react";

const Conversation = () => {
  return (
    <Stack height={"100%"} maxHeight={"100vh"} width={"auto"}>
      {/* Chat Header */}
      <Box sx={{ height: 100, width: "100%", backgroundColor: "#000" }}></Box>
      {/* Msg */}
      <Box width={"100%"} sx={{ flexGrow: 1 }}></Box>
      {/* Chat footer */}
      <Box sx={{ height: 100, width: "100%", backgroundColor: "#000" }}></Box>
    </Stack>
  );
};

export default Conversation;
