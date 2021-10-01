import Navbar from "../components/Navbar";
import { withUrqlClient } from "next-urql";
import { createURQLClient } from "../utils/createURQLClient";
import { usePostsQuery } from "../generated/graphql";
import Wrapper from "../components/Wrapper";
import { Box, Heading, Link, Stack, Text } from "@chakra-ui/layout";
import NextLink from "next/link";
import React, { useState } from "react";
import { Button } from "@chakra-ui/button";

const Index = () => {
  const [{ data }] = usePostsQuery({ variables: { limit: 10 } });
  const [text, setText] = useState(false);

  return (
    <>
      <Navbar />
      <Wrapper>
        <NextLink href="/create-posts">
          <Link>Post</Link>
        </NextLink>
        <br />

        <Stack spacing={8}>
          {data?.posts ? (
            data.posts.map((item) => (
              <Box key={item.id} p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{item.title}</Heading>
                <Text mt={4}>{item.text.slice(0, 100)}</Text>
              </Box>
            ))
          ) : (
            <div>Nothing renter</div>
          )}
        </Stack>
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createURQLClient, { ssr: true })(Index);
