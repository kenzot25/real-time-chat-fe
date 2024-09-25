import { Flex } from "@mantine/core";

interface Props {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <Flex>
        <Flex>{children}</Flex>
      </Flex>
    </>
  );
};

export default MainLayout;
