import { VStack, Icon, Text } from "@chakra-ui/react";
import { FC, memo } from "react";
import { IconType } from "react-icons";
import { Link } from "react-router-dom";

type Props = {
    children: string;
    url: string;
    icon: IconType;
};

export const IconLink: FC<Props> = memo(({ children, url, icon }) => {
    return (
        <Link to={url}>
            <VStack spacing="0">
                <Icon as={icon} fontSize="30px" m="0" />
                <Text fontSize="14px">{children}</Text>
            </VStack>
        </Link>
    );
});
