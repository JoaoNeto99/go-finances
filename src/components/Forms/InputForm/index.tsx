import React from "react";
import {Container, Error} from "./styles";
import {Input} from "../Input";
import {TextInputProps} from "react-native";
import {Control, Controller, FieldError, FieldErrorsImpl, Merge} from "react-hook-form";

interface Props extends TextInputProps {
    control: Control;
    name: string;
    error: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

export function InputForm({control, name, error, ...rest}: Props) {
    return (
        <Container>
            <Controller
                control={control}
                render={({field: {onChange, value}}) => (
                        <Input
                            onChangeText={onChange}
                            value={value}
                            {...rest}
                        />
                    )}
                name={name}
            />
            {error && <Error>{error}</Error>}
        </Container>
    )
}
