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
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import {useNavigation} from "@react-navigation/native";
import {useAuth} from "../../hooks/auth";

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
});

type NavigationProps = {
    navigate:(screen:string) => void;
}

export function Register() {
    const [transactionType, setTransactionType] = useState('');

    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [category, setCategory] = useState({key: 'category', name: 'Categoria'});

    const {control, handleSubmit, reset, formState: {errors}} = useForm({resolver: yupResolver(schema)})

    const navigation = useNavigation<NavigationProps>();

    const {user} = useAuth()

    function handleTransactionTypeSelect(type: "positive" | "negative") {
        setTransactionType(type);
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false);
    }

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    }

    async function handleRegister(form: Partial<FormData>) {
        if (!transactionType) {
            return Alert.alert("Selecione o tipo de transação");
        }

        if (category.key === 'category') {
            return Alert.alert("Selecione a categoria");
        }

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        console.log(newTransaction)

        try {
            const dataKey = `@gofinances:transactions_user:${user.id}`;
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [
                ...currentData,
                newTransaction
            ];

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

            reset();
            setTransactionType('');
            setCategory({key: 'category', name: 'Categoria'});

            navigation.navigate("Listagem")
        } catch (error) {
            console.log(error);
            Alert.alert("Não foi possível salvar.")
        }

    }

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
                                onPress={() => {
                                    handleTransactionTypeSelect('positive')
                                }}
                                isActive={transactionType === 'positive'}
                            />
                            <TransactionTypeButton
                                title={"Outcome"}
                                type={"down"}
                                onPress={() => handleTransactionTypeSelect('negative')}
                                isActive={transactionType === 'negative'}
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
