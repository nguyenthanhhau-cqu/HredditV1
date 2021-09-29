import { Button } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/dist/client/router"
import React from "react"
import InputField from "../components/InputField"
import Navbar from "../components/Navbar"
import Wrapper from "../components/Wrapper"
import { useCreatePostMutation } from "../generated/graphql"
import { createURQLClient } from "../utils/createURQLClient"
import { toErrorMap } from "../utils/toErrorMap"








const CreatePosts = () => {
    const router = useRouter()
    const [,createPosts] = useCreatePostMutation()
    
    return (
        <>
        <Navbar />
        <Wrapper variant="small">
            <Formik initialValues={{ title: "", text: "" }}
                onSubmit={async (values, { setErrors }) => {
                    await createPosts({title: values.title, text: values.text})
                    router.push("/");
                }}>
                {
                    ({ isSubmitting }) => (
                        <Form>
                            <InputField name="title" placeholder="title" label="Title" />
                            <InputField textarea name="text" placeholder="text" label="Text" />
                            <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="teal">Submit</Button>
                        </Form>
                    )
                }
            </Formik>
        </Wrapper>
        </>
    )
}

export default withUrqlClient(createURQLClient,{ssr:true})(CreatePosts)