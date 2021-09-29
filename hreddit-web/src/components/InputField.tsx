import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Textarea } from "@chakra-ui/react"
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string,
    label: string,
    placeholder?: string,
    textarea?: boolean
}

export const InputField: React.FC<InputFieldProps> = ({ label, size: _, textarea, ...props }) => {
    const [field, { error }] = useField(props)
    //return true or false
    let InputOrTextArea = Input;

    if (textarea) {
        InputOrTextArea = Textarea as any;
    }

    return (<FormControl isInvalid={!!error}>
        <FormLabel htmlFor={field.name} >{label}</FormLabel>
        <InputOrTextArea {...props} id={field.name} {...field} />
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>);
}

export default InputField