import React, { Fragment } from 'react'
import {

    Button,
} from "@chakra-ui/react"

import { Formik, Form } from "formik"
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useMutation, useQuery } from 'urql';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/dist/client/router';
import { withUrqlClient } from 'next-urql';
import { createURQLClient } from '../utils/createURQLClient';

interface registerProps {

}

export const Register: React.FC<registerProps> = ({ }) => {
    const router = useRouter()
    const [, register] = useRegisterMutation()
    return (
        <Wrapper variant="small">
            <Formik initialValues={{ userName: "", passWord: "", email: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const res = await register({ options: values })
                    if (res.data?.register.errors) {
                        setErrors(toErrorMap(res.data.register.errors))
                    } else if (res.data.register.user) {
                        router.push('/')
                    }
                }}>
                {
                    ({ isSubmitting }) => (
                        <Form>
                            <InputField name="userName" placeholder="username" label="Username" />
                            <InputField name="passWord" placeholder="password" label="password" type="password" />
                            <InputField name="email" placeholder="email" label="email" />
                            <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="teal">Submit</Button>
                        </Form>
                    )
                }
            </Formik>
        </Wrapper>
    );
}
export default withUrqlClient(createURQLClient)(Register)