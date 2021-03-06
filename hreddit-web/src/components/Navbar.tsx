import { Box, Flex, Link } from '@chakra-ui/layout';
import React from 'react'
import NextLink from "next/link"
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { Button } from '@chakra-ui/button';
import { isServer } from '../utils/isServer';
interface NavbarProps {

}

export const Navbar: React.FC<NavbarProps> = ({ }) => {
    const [{ data, fetching }] = useMeQuery({
        pause: isServer() //tell QUERY to pause the query at NextJS server because we just want to QUERY on browser
    })



    const [, logout] = useLogoutMutation()
    let body = null
    if (fetching) {
        body = null;
    } else if (!data?.me) {
        body = (<>
            <NextLink href="/login">
                <Link mr={2}>Login</Link>
            </NextLink>
            <NextLink href="/register">
                <Link>Register</Link>
            </NextLink>
        </>)

    } else {
        body = (<Flex><Box mr={10}>Hello {data.me.userName}</Box>
            <Button variant="link" color="black" onClick={() => logout()}>Logout</Button></Flex>)
    }

    return (
        <Flex zIndex={2} position="sticky" top={0} bg="tan" p={4}>
            <Box ml={'auto'}>
                {body}
            </Box>
        </Flex>
    );
}

export default Navbar