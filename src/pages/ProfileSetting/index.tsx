import { useMutation } from "@apollo/client";
import {
  Avatar,
  Button,
  FileInput,
  Flex,
  Group,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEditCircle } from "@tabler/icons-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UPDATE_PROFILE } from "../../graphql/mutations/UpdateUserProfile";
import { useUserStore } from "../../stores/userStore";

function ProfileSettings() {
  const navigate = useNavigate();

  const profileImage = useUserStore((state) => state.avatarUrl);
  const updateProfileImage = useUserStore((state) => state.updateProfileImage);
  const fullname = useUserStore((state) => state.fullname);
  const updateUsername = useUserStore((state) => state.updateUsername);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imagePreview = imageFile ? URL.createObjectURL(imageFile) : null;

  const fileInputRef = React.useRef<HTMLButtonElement>(null);

  const form = useForm({
    initialValues: {
      fullname: fullname,
      profileImage: profileImage,
    },
    validate: {
      fullname: (value: string) =>
        value.trim().length >= 3
          ? null
          : "Username must be at least 3 characters",
    },
  });

  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    variables: {
      fullname: form.values.fullname,
      file: imageFile,
    },

    onCompleted: (data) => {
      updateProfileImage(data.updateProfile.avatarUrl);
      updateUsername(data.updateProfile.fullname);
    },
  });
  const handleSave = async () => {
    if (form.validate().hasErrors) return;
    await updateProfile().then(() => {
      navigate("/");
    });
  };
  return (
    <form onSubmit={form.onSubmit(() => handleSave())}>
      <Group
        pos="relative"
        w={100}
        h={100}
        style={{ cursor: "pointer", margin: "auto" }}
        onClick={() => fileInputRef.current?.click()}
      >
        <Avatar
          src={imagePreview || profileImage || null}
          alt="Profile"
          h={100}
          w={100}
          radius={100}
        />
        <IconEditCircle
          color="black"
          size={20}
          style={{
            position: "absolute",
            top: 50,
            right: -10,
            background: "white",
            border: "1px solid black",
            padding: 5,
            borderRadius: 100,
          }}
        />
        <FileInput
          ref={fileInputRef}
          style={{ display: "none" }}
          pos={"absolute"}
          accept="image/*"
          onChange={(file) => setImageFile(file)}
        />
      </Group>
      <TextInput
        style={{ marginTop: 20, textAlign: "left" }}
        label="Username"
        {...form.getInputProps("fullname")}
        onChange={(event) => {
          form.setFieldValue("fullname", event.currentTarget.value);
        }}
        error={form.errors.fullname}
      />
      <Flex gap="md" mt="sm" align="center">
        <Button mx="auto" onClick={handleSave}>
          Save
        </Button>
        <Button
          mx="auto"
          color="red"
          onClick={() => {
            navigate("/");
          }}
        >
          Back
        </Button>
      </Flex>
    </form>
  );
}

export default ProfileSettings;
