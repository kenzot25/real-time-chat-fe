import {
  Center,
  Navbar,
  Stack,
  Tooltip,
  UnstyledButton,
  createStyles,
  rem,
} from "@mantine/core";
import { useState } from "react";

import { useMutation } from "@apollo/client";
import {
  IconBrandMessenger,
  IconBrandWechat,
  IconLogin,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { LOGOUT_USER } from "../../graphql/mutations/Logout";
import { useUserStore } from "../../stores/userStore";

const useStyles = createStyles((theme) => {
  return {
    link: {
      width: rem(50),
      height: rem(50),
      borderRadius: theme.radius.md,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[0]
          : theme.colors.gray[7],

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[0],
      },
    },
    active: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({
          variant: "light",
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  };
});

interface NavbarLinkProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.FC<any>;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
    <Tooltip
      label={label}
      position="top-start"
      offset={-30}
      transitionProps={{ duration: 0 }}
    >
      <UnstyledButton
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        <Icon size="1.2rem" stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}
const mockdata = [{ icon: IconBrandWechat, label: "Chatrooms" }];

function Sidebar() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));
  const userId = useUserStore((state) => state.id);
  const user = useUserStore((state) => state);
  const setUser = useUserStore((state) => state.setUser);

  const [logoutUser] = useMutation(LOGOUT_USER, {
    onCompleted: () => {
      navigate("login");
    },
  });

  const handleLogout = async () => {
    await logoutUser();
    setUser({
      id: undefined,
      fullname: "",
      avatarUrl: null,
      email: "",
    });
  };

  return (
    <Navbar fixed zIndex={100} w={rem(100)} p="md">
      <Center>
        <IconBrandMessenger type="mark" size={30} />
      </Center>
      <Navbar.Section grow mt={50}>
        <Stack justify="center" spacing={0}>
          {userId && links}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack justify="center" spacing={0}>
          {userId && (
            <NavbarLink
              icon={IconUser}
              label={"Profile(" + user.fullname + ")"}
              onClick={() => {
                navigate("/profile");
              }}
            />
          )}

          {userId ? (
            <NavbarLink
              icon={IconLogout}
              label="Logout"
              onClick={handleLogout}
            />
          ) : (
            <NavbarLink
              icon={IconLogin}
              label="Login"
              onClick={() => {
                navigate("login");
              }}
            />
          )}
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}

export default Sidebar;
