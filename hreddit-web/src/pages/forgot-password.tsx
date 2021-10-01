import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useState } from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createURQLClient } from "../utils/createURQLClient";

const ForgotPassword = () => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [emailMessage, setEmailMessage] = useState(false);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setErrors }) => {
          await forgotPassword(values);
          setEmailMessage(true);
        }}
      >
        {({ isSubmitting }) =>
          emailMessage ? (
            <Box>
              If your email is exist, login to your mail to check the link we
              provide
            </Box>
          ) : (
            <Form>
              <InputField name="email" placeholder="email" label="Email" />
              <Button
                type="submit"
                mt={4}
                isLoading={isSubmitting}
                colorScheme="teal"
              >
                Send
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createURQLClient)(ForgotPassword);
