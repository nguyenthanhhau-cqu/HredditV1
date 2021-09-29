import { NextPage } from 'next';
import React, { useState } from 'react'

import {

    Box,
    Button,
    Flex,
    Link,
} from "@chakra-ui/react"

import { Formik, Form } from "formik"
import Wrapper from '../../components/Wrapper';
import InputField from '../../components/InputField';
import { useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import { Router, useRouter } from 'next/dist/client/router';
import { createURQLClient } from '../../utils/createURQLClient';
import { withUrqlClient } from 'next-urql';
import NextLink from "next/link"



export const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
    const [, changePassword] = useChangePasswordMutation()
    const router = useRouter()
    const [tokenError, setTokenError] = useState("")
    return (<div>
        <Wrapper variant="small">
            <Formik initialValues={{ newPassword: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const res = await changePassword({ newPassword: values.newPassword, token: token })
                    if (res.data?.changePassword.errors) {
                        const errorMap = toErrorMap(res.data.changePassword.errors)
                        if ("token" in errorMap) {
                            setTokenError(errorMap.token)
                        }
                        setErrors(errorMap)
                    } else if (res.data.changePassword.user) {
                        router.push('/')
                    }
                }}>
                {
                    ({ isSubmitting }) => (
                        <Form>
                            <InputField name="newPassword" placeholder="Enter New Password" label="New password" type="password" />
                            {tokenError && <Flex><Box mr={2} color="red">{tokenError}</Box>
                                <NextLink href="/forgot-password"><Link>Click here to try another one</Link></NextLink>
                            </Flex>}
                            <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="teal">Change </Button>
                        </Form>
                    )
                }
            </Formik>
        </Wrapper></div>);
}
ChangePassword.getInitialProps = ({ query }) => {
    return {
        token: query.token as string
    }
}
export default withUrqlClient(createURQLClient)(ChangePassword)