import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
  Slide,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Avatar from "react-avatar";
import { faker } from "@faker-js/faker";
import {
  Bell,
  CaretRight,
  Phone,
  Prohibit,
  Star,
  Trash,
  VideoCamera,
  X,
  Users,
} from "phosphor-react";
import useResponsive from "../../hooks/useResponsive";
import AntSwitch from "../../components/AntSwitch";
import { useDispatch, useSelector } from "react-redux";
import { ToggleSidebar, UpdateSidebarType } from "../../redux/slices/app";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BlockDialog = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Cảnh báo</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Bạn có chắc chắn muốn chặn người này?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button onClick={handleClose}>Tiếp tục</Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteChatDialog = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Xóa lịch sử</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Bạn có chắc chắn muốn xóa lịch sử đoạn chat này?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button onClick={handleClose}>Tiếp tục</Button>
      </DialogActions>
    </Dialog>
  );
};

const Contact = () => {
  const dispatch = useDispatch();

  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const { user_id } = useSelector((state) => state.auth);
  const { conversations } = useSelector(
    (state) => state.conversation.group_chat
  );
  const commonGroup = conversations.filter((conversation) => {
    return (
      conversation?.users.filter((user) => {
        return (
          user?._id == user_id || user?._id == current_conversation.user_id
        );
      }).length == 2
    );
  });
  const theme = useTheme();

  const isDesktop = useResponsive("up", "md");

  const [openBlock, setOpenBlock] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseBlock = () => {
    setOpenBlock(false);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

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
            justifyContent="space-between"
            spacing={3}
          >
            <Typography variant="subtitle2">Thông tin hội thoại</Typography>
            <IconButton
              onClick={() => {
                dispatch(ToggleSidebar());
              }}
            >
              <X />
            </IconButton>
          </Stack>
        </Box>
        <Stack
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflow: "scroll",
          }}
          p={3}
          spacing={3}
        >
          <Stack alignItems="center" direction="row" spacing={2}>
            <Avatar name={current_conversation?.name} size={64} round={true} src={current_conversation?.avatar}/>
            <Stack spacing={0.5}>
              <Typography variant="article" fontWeight={600}>
                {current_conversation?.name}
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {"+91 62543 28 739"}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={"space-evenly"}
          >
            <Stack alignItems={"center"} spacing={1}>
              <IconButton>
                <Phone />
              </IconButton>

              <Typography variant="overline">Voice</Typography>
            </Stack>
            <Stack alignItems={"center"} spacing={1}>
              <IconButton>
                <VideoCamera />
              </IconButton>
              <Typography variant="overline">Video</Typography>
            </Stack>
          </Stack>
          {/* <Stack spacing={0.5}>
            <Typography variant="article" fontWeight={600}>
              About
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {current_conversation?.about}
            </Typography>
          </Stack> */}
          <Divider />
          <Stack flexDirection={"row"}style={{gap:"16px",alignItems:'center'}}>
            <Users size={20}/>
            <Typography
              variant="body2"
              onClick={() => {
                dispatch(UpdateSidebarType("CommonGroup"));
              }}
            >
              {commonGroup.length} nhóm chung
            </Typography>
          </Stack>
          <Divider />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Typography variant="subtitle2">Ảnh/Video/Tài liệu</Typography>
            <Button
              onClick={() => {
                dispatch(UpdateSidebarType("SHARED"));
              }}
              endIcon={<CaretRight />}
            >
              Xem tất cả
            </Button>
          </Stack>
          <Stack direction={"row"} alignItems="center" spacing={2}>
            {[1, 2, 3].map((el) => (
              <Box>
                <img src={faker.image.city()} alt={faker.internet.userName()} />
              </Box>
            ))}
          </Stack>
          <Divider />
          {/* <Stack
            direction="row"
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Star size={21} />
              <Typography variant="subtitle2">Starred Messages</Typography>
            </Stack>

            <IconButton
              onClick={() => {
                dispatch(UpdateSidebarType("STARRED"));
              }}
            >
              <CaretRight />
            </IconButton>
          </Stack> */}
          <Divider />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Bell size={21} />
              <Typography variant="subtitle2">Tắt thông báo</Typography>
            </Stack>

            <AntSwitch />
          </Stack>
          <Divider />
          <Stack direction="column" alignItems={"center"} spacing={2}>
            <Button
              onClick={() => {
                setOpenBlock(true);
              }}
              fullWidth
              startIcon={<Prohibit />}
              variant="outlined"
            >
              Chặn
            </Button>
            <Button
              onClick={() => {
                setOpenDelete(true);
              }}
              fullWidth
              startIcon={<Trash />}
              variant="outlined"
            >
              Xóa lịch sử trò chuyện
            </Button>
          </Stack>
        </Stack>
      </Stack>
      {openBlock && (
        <BlockDialog open={openBlock} handleClose={handleCloseBlock} />
      )}
      {openDelete && (
        <DeleteChatDialog open={openDelete} handleClose={handleCloseDelete} />
      )}
    </Box>
  );
};

export default Contact;
