import React from "react";
import {
    Container,
    Header,
    Photo,
    User,
    UserWrapper,
    UserGreeting,
    UserInfo,
    UserName,
    Icon,
    HightLightCards,
    Transactions,
    Title
} from "./styles";
import {HightLightCard} from "../../components/HightLightCard";
import {TransactionCard} from "../../components/TransactionCard";


export function Dashboard() {
    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{uri: 'https://avatars.githubusercontent.com/u/52896732?v=4'}}/>
                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>João Neto</UserName>
                        </User>
                    </UserInfo>
                    <Icon name={'power'}/>
                </UserWrapper>
            </Header>
            <HightLightCards>
                <HightLightCard
                    type={'up'}
                    title={"Entrada"}
                    amount={"R$ 17.400,00"}
                    lastTransaction={"Última entrada dia 13 de abril"}
                />
                <HightLightCard
                    type={'down'}
                    title={"Saídas"}
                    amount={"R$ 1.259,00"}
                    lastTransaction={"Última entrada dia 03 de abril"}
                />
                <HightLightCard
                    type={'total'}
                    title={"Total"}
                    amount={"R$ 16.141,00"}
                    lastTransaction={"01 à 16 de abril"}
                />
            </HightLightCards>
            <Transactions>
                <Title>Listagem</Title>
                <TransactionCard/>
            </Transactions>
        </Container>
    )
}
