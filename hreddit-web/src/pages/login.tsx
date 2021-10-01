import React from "react";
import { Box, Button, Flex, Link } from "@chakra-ui/react";

import { Formik, Form } from "formik";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";
import { createURQLClient } from "../utils/createURQLClient";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";

interface LoginProps {}

export const Login: React.FC<LoginProps> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ userNameOrEmail: "", passWord: "" }}
        onSubmit={async (values, { setErrors }) => {
          const res = await login({
            userNameOrEmail: values.userNameOrEmail,
            passWord: values.passWord,
          });
          if (res.data?.login.errors) {
            setErrors(toErrorMap(res.data.login.errors));
          } else if (res.data.login.user) {
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="userNameOrEmail"
              placeholder="username"
              label="Username"
            />
            <InputField
              name="passWord"
              placeholder="password"
              label="Password"
              type="password"
            />
            <Flex mt="2">
              <NextLink href="/forgot-password">
                <Link ml="auto">Forgot password?</Link>
              </NextLink>
            </Flex>
            <Button
              type="submit"
              mt={4}
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};
export default withUrqlClient(createURQLClient)(Login);
