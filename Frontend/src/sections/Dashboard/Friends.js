import React, { useEffect } from "react";
import { Dialog, DialogContent, Slide, Stack, Tab, Tabs } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchFriendRequests,
  FetchFriends,
  FetchUsers,
  FetchFriendInvitations
} from "../../redux/slices/app";
import { FriendElement, FriendRequestElement, UserElement } from "../../components/UserElement";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UsersList = ({handleClose}) => {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.app);
  useEffect(() => {
    dispatch(FetchUsers());
    console.log("đã phát fetch user rôi")
  }, []);

  return (
    <>
      {users.map((el, idx) => {
        return <UserElement key={idx} {...el} handleClose={handleClose}/>;
      })}
    </>
  );
};

const FriendsList = ({handleClose}) => {
  const dispatch = useDispatch();

  const { friends } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(FetchFriends());
  }, []);

  return (
    <>
      {friends.map((el, idx) => {
        return <FriendElement key={idx} {...el} handleClose={handleClose}/>;
      })}
    </>
  );
};

const RequestsList = () => {
  const dispatch = useDispatch();
  console.log('chuyển tab')
  const { friendRequests } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(FetchFriendRequests());
  }, []);

  return (
    <>
      {friendRequests.map((el, idx) => {
        return <FriendRequestElement key={idx} {...el.sender} id={el._id} />;
      })}
    </>
  );
};

const Friends = ({ open, handleClose }) => {
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch();
  console.log(handleClose)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    dispatch(FetchFriendInvitations());
  }, []);

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{ p: 4 }}
    >
      {/* <DialogTitle>{"Friends"}</DialogTitle> */}
      <Stack p={2} sx={{ width: "100%" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Khám phá" />
          <Tab label="Bạn bè" />
          <Tab label="Lời mời kết bạn" />
        </Tabs>
      </Stack>
      <DialogContent>
        <Stack sx={{ height: "100%" }}>
          <Stack spacing={2.4}>
            {(() => {
              switch (value) {
                case 0: // display all users in this list
                  return <UsersList handleClose={handleClose}/>;

                case 1: // display friends in this list
                  return <FriendsList handleClose={handleClose}/>;

                case 2: // display request in this list
                  return <RequestsList />;

                default:
                  break;
              }
            })()}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default Friends;
