import React from "react";
import {
    Container,
    Title,
    Amout,
    Footer,
    Category,
    Icon,
    CategoryName,
    Date
} from "./styles";

interface Category {
    name: string //Salario Mensal
    icon: string
}

export interface TransactionCardProps {
    type: 'positive' | 'negative'
    title: string,
    amount: string,
    category: Category,
    date: string,

}

interface Props {
    data: TransactionCardProps
}


export function TransactionCard({data}: Props) {
    return (
        <Container>
            <Title>
                {data.title}
            </Title>
            <Amout type={data.type}>
                {data.type === 'negative' && '- '}
                {data.amount}
            </Amout>

            <Footer>
                <Category>
                    <Icon name={data.category.icon}/>
                    <CategoryName>
                        {data.category.name}
                    </CategoryName>
                </Category>

                <Date>
                    {data.date}
                </Date>
            </Footer>
        </Container>
    );
}
