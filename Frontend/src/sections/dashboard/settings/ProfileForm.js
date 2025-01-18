import React, { useCallback, useState } from "react";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "../../../components/hook-form/FormProvider";
import { RHFTextField, RHFUploadAvatar } from "../../../components/hook-form";
import { Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../../redux/slices/app";
import { socket, connectSocket } from "../../../socket.js";
import { useNavigate } from "react-router-dom";

const ProfileForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [file, setFile] = useState();
  const { user } = useSelector((state) => state.app);
  const { user_id, token } = useSelector((state) => state.auth);
  const ProfileSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    avatar: Yup.string().required("Avatar is required").nullable(true),
  });
  const defaultValues = {
    name: user?.firstName + " " + user.lastName,
    avatar:
      user.avatar ||
      `https://www.kindpng.com/picc/m/421-4212275_transparent-default-avatar-png-avatar-img-png-download.png`,
  };

  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = methods;
  const onSubmit = async (data) => {
    try {
      dispatch(updateProfile({ avatar: data.avatar, name: data.name }));
      navigate("/app");
      // Sử dụng fetch để gửi yêu cầu POST
      await fetch("http://localhost:4000/user/update-me", {
        method: "PATCH", // Phương thức POST
        headers: {
          "Content-Type": "application/json", // Đảm bảo dữ liệu được gửi dưới dạng JSON
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: data.avatar, name: data.name }), // Chuyển đối tượng data thành chuỗi JSON
      });
  
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setFile(file);
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64 = reader.result;
        console.log("Base64:", base64);
        setValue("avatar", base64, { shouldValidate: true });
      };

      if (file) {
        reader.readAsDataURL(file); // Đọc file và chuyển thành Base64
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <RHFUploadAvatar name="avatar" maxSize={3145728} onDrop={handleDrop} />

        <RHFTextField name="name" label="Name" />
        {/* <RHFTextField multiline rows={4} name="about" label="About" /> */}

        <Stack direction={"row"} justifyContent="end">
          <LoadingButton
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            // onClick={()=>{
            //   console.log(
            //     "click"
            //   )
            // }}
            // loading={isSubmitSuccessful || isSubmitting}
          >
            Save
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default ProfileForm;
