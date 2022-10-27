import React, {useState} from "react";
import {Container, Fields, Form, Header, Title, TransactionsTypes} from "./styles";
import {Button} from "../../components/Forms/Button";
import {TransactionTypeButton} from "../../components/Forms/TransactionTypeButton";
import {CategorySelectButton} from "../../components/Forms/CategorySelectButton";
import {Alert, Keyboard, Modal, TouchableWithoutFeedback} from "react-native";
import {CategorySelect} from "../CategorySelect";
import {InputForm} from "../../components/Forms/InputForm";
import {useForm} from "react-hook-form";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";

interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup.string()
        .required('Nome e obrigatório'),
    amount: Yup.number()
        .typeError('Informe, um valor número')
        .positive('O valor não pode ser negativo')
        .required('O valor é obrigatório')
})

export function Register() {
    const [transctionType, setTransctionType] = useState('');

    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [category, setCategory] = useState({key: 'category', name: 'Categoria'});

    const {control, handleSubmit, formState: {errors}} = useForm({resolver: yupResolver(schema)})

    function handleTransactionTypeSelect(type: "up" | "down") {
        setTransctionType(type);
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false);
    }

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    }

    function handleRegister(form: FormData ) {
        if(!transctionType) {
            return Alert.alert("Selecione o tipo de transação");
        }

        if(category.key === 'category') {
            return Alert.alert("Selecione a categoria");
        }

        const data = {
            name: form.name,
            amount: form.amount,
            transctionType,
            category: category.key
        }
    }

    // @ts-ignore
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>

                <Header>
                    <Title>Cadastro</Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm
                            name={'name'}
                            control={control}
                            placeholder={"Nome"}
                            autoCapitalize={"sentences"}
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />
                        <InputForm
                            name={'amount'}
                            control={control}
                            placeholder={"Preço"}
                            keyboardType={"numeric"}
                            error={errors.amount && errors.amount.message}
                        />
                        <TransactionsTypes>
                            <TransactionTypeButton
                                title={"Income"}
                                type={"up"}
                                onPress={() => handleTransactionTypeSelect('up')}
                                isActive={transctionType === 'up'}
                            />
                            <TransactionTypeButton
                                title={"Outcome"}
                                type={"down"}
                                onPress={() => handleTransactionTypeSelect('down')}
                                isActive={transctionType === 'down'}
                            />
                        </TransactionsTypes>
                        <CategorySelectButton
                            title={category.name}
                            onPress={handleOpenSelectCategoryModal}
                        />
                    </Fields>
                    <Button
                        title={"Enviar"}
                        onPress={handleSubmit(handleRegister)}
                    />
                </Form>

                <Modal visible={categoryModalOpen}>
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>

            </Container>
        </TouchableWithoutFeedback>
    );
}
