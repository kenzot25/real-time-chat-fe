import { useMutation } from "@apollo/client";
import {
  Button,
  Col,
  Grid,
  Group,
  Paper,
  rem,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { GraphQLErrorExtensions } from "graphql";
import React from "react";
import { useNavigate } from "react-router-dom";
import { RegisterUserMutation } from "../../gql/graphql";
import { REGISTER_USER } from "../../graphql/mutations/Register";
import { useUserStore } from "../../stores/userStore";

const Register = () => {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      fullname: (value: string) =>
        value.trim().length >= 3
          ? null
          : "Username must be at least 3 characters",
      email: (value: string) => (value.includes("@") ? null : "Invalid email"),
      password: (value: string) =>
        value.trim().length >= 3
          ? null
          : "Password must be at least 3 characters",
      confirmPassword: (value: string, values) =>
        value.trim().length >= 3 && value === values.password
          ? null
          : "Passwords do not match",
    },
  });
  const setUser = useUserStore((state) => state.setUser);

  const [errors, setErrors] = React.useState<GraphQLErrorExtensions>({});

  const [registerUser, { loading }] =
    useMutation<RegisterUserMutation>(REGISTER_USER);

  const handleRegister = async () => {
    setErrors({});

    await registerUser({
      variables: {
        email: form.values.email,
        password: form.values.password,
        fullname: form.values.fullname,
        confirmPassword: form.values.confirmPassword,
      },
      onCompleted: (data) => {
        setErrors({});
        if (data?.register.user)
          setUser({
            id: data?.register.user.id,
            email: data?.register.user.email,
            fullname: data?.register.user.fullname,
          });
        navigate("/");
      },
    }).catch((err) => {
      console.log(err.graphQLErrors, "ERROR");
      setErrors(err.graphQLErrors[0]?.extensions);
    });
  };

  const handleClickLogin = () => {
    navigate("/login");
  };

  return (
    <Paper w={rem(400)} withBorder radius={10} p={20}>
      <Text align="center" size="xl">
        Register
      </Text>

      <form
        onSubmit={form.onSubmit(() => {
          handleRegister();
        })}
      >
        <Grid style={{ marginTop: 20, textAlign: "left" }}>
          <Col span={12} md={12}>
            <TextInput
              label="Fullname"
              placeholder="Choose a full name"
              {...form.getInputProps("fullname")}
              error={form.errors.username || (errors?.username as string)}
            />
          </Col>

          <Col span={12} md={12}>
            <TextInput
              autoComplete="off"
              label="Email"
              placeholder="Enter your email"
              {...form.getInputProps("email")}
              error={form.errors.email || (errors?.email as string)}
            />
          </Col>
          <Col span={12} md={12}>
            <TextInput
              autoComplete="off"
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...form.getInputProps("password")}
              error={form.errors.password || (errors?.password as string)}
            />
          </Col>
          <Col span={12} md={12}>
            <TextInput
              {...form.getInputProps("confirmPassword")}
              error={
                form.errors.confirmPassword ||
                (errors?.confirmPassword as string)
              }
              autoComplete="off"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
            />
          </Col>

          <Col span={12}>
            <Button variant="link" onClick={handleClickLogin} pl={0} fullWidth>
              <Text align="center">Already registered? Login here</Text>
            </Button>
          </Col>
        </Grid>

        <Group position="center" mt={20}>
          <Button
            variant="outline"
            color="blue"
            type="submit"
            disabled={loading}
          >
            Register
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default Register;
