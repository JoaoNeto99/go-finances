import React, {useCallback, useEffect, useState} from "react";
import {
    Container,
    Header,
    HightLightCards,
    LogoutButton,
    Icon,
    Photo,
    Title,
    TransactionList,
    Transactions,
    User,
    UserGreeting,
    UserInfo,
    UserName,
    UserWrapper,
    LoadContainer,
} from "./styles";
import {HightLightCard} from "../../components/HightLightCard";
import {TransactionCard, TransactionCardProps} from "../../components/TransactionCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";
import {ActivityIndicator} from "react-native";
import {useTheme} from "styled-components";
import {useAuth} from "../../hooks/auth";

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
    lastTransaction: string
}

interface HighlightData {
    entries: HighlightProps,
    expensive: HighlightProps,
    total: HighlightProps
}


function getLastTransactionData(collection: DataListProps[], type: 'positive' | 'negative') {

    const collectionFiltered = collection.filter((transaction) => transaction.type === type)

    if (collectionFiltered.length === 0) {
        return 0
    }

    const lastTransactions = new Date(Math.max.apply(Math, collectionFiltered
        .map((transaction) => new Date(transaction.date).getTime())))

    return `${lastTransactions.getDate()} de ${lastTransactions.toLocaleDateString('pt-BR', {month: "long"})}`;
}

export function Dashboard() {

    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>();
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    const theme = useTheme()
    const {signOut, user} = useAuth()

    async function loadTransactions() {
        const dataKey = `@gofinances:transactions_user:${user.id}`;

        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entreisTotal = 0;
        let expansiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {

            if (item.type === 'positive') {
                entreisTotal += Number(item.amount);
            } else {
                expansiveTotal += Number(item.amount);
            }

            const amount = Number(item.amount)
                .toLocaleString("pt-BR", {style: 'currency', currency: 'BRL'});

            const date = Intl.DateTimeFormat('pt-BR', {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit"
            }).format(new Date(item.date));

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date
            }
        });

        setTransactions(transactionsFormatted)

        const lastTransactionsEntries = getLastTransactionData(transactions, 'positive')
        const lastTransactionsExpensives = getLastTransactionData(transactions, 'negative')
        const totalInterval = lastTransactionsEntries === 0 && lastTransactionsExpensives === 0
            ? `Não há transações`
            : lastTransactionsEntries ? `01 a ${lastTransactionsEntries}` : `01 a ${lastTransactionsExpensives}`


        const total = entreisTotal - expansiveTotal;
        setHighlightData({
            entries: {
                amount: entreisTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction: lastTransactionsEntries === 0
                    ? `Não há transações`
                    : `Ultima entrada dia ${lastTransactionsEntries}`
            },
            expensive: {
                amount: expansiveTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction: lastTransactionsExpensives === 0
                    ? `Não há transações`
                    :`Ultima saída dia ${lastTransactionsExpensives}`
            },
            total: {
                amount: total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction: totalInterval
            },
        })

        setIsLoading(false)
    }

    useEffect(() => {
        loadTransactions();

    }, []);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []))


    return (
        <Container>
            {
                isLoading ?
                    <LoadContainer>
                        <ActivityIndicator color={theme.colors.primary} size={"large"}/>
                    </LoadContainer>
                    :
                    <>
                        <Header>
                            <UserWrapper>
                                <UserInfo>
                                    <Photo source={{uri: user.photo}}/>
                                    <User>
                                        <UserGreeting>Olá,</UserGreeting>
                                        <UserName>{user.name}</UserName>
                                    </User>
                                </UserInfo>
                                <LogoutButton
                                    onPress={() => signOut()}
                                >
                                    <Icon name={'power'}/>
                                </LogoutButton>

                            </UserWrapper>
                        </Header>
                        <HightLightCards>
                            <HightLightCard
                                type={'up'}
                                title={"Entrada"}
                                amount={highlightData.entries.amount}
                                lastTransaction={highlightData.entries.lastTransaction}
                            />
                            <HightLightCard
                                type={'down'}
                                title={"Saídas"}
                                amount={highlightData.expensive.amount}
                                lastTransaction={highlightData.expensive.lastTransaction}
                            />
                            <HightLightCard
                                type={'total'}
                                title={"Total"}
                                amount={highlightData.total.amount}
                                lastTransaction={highlightData.total.lastTransaction}
                            />
                        </HightLightCards>


                        <Transactions>
                            <Title>Listagem</Title>

                            <TransactionList
                                data={transactions}
                                keyExtractor={(item) => item.id}
                                renderItem={({item}) => <TransactionCard data={item}/>}

                            />

                        </Transactions>
                    </>}
        </Container>
    )
}
