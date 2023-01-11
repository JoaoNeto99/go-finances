import React, {useContext, useState} from "react";
import {Container, Footer, FooterWrapper, Header, SignInTitle, Title, TitleWrapper} from './styles';

import LogoSvg from "./../../assets/logo.svg";
import GoogleSvg from "./../../assets/google.svg";
import AppleSvg from "./../../assets/apple.svg";

import {RFValue} from "react-native-responsive-fontsize";
import {SignInSocialButton} from "../../components/SignInSocialButton";
import {useAuth} from "../../hooks/auth";
import {ActivityIndicator, Alert, Platform} from "react-native";
import theme from "../../global/styles/theme";
import {useTheme} from "styled-components";

export function SingIn() {
    const [isLoading, setIsLoading] = useState(false);
    const theme = useTheme()

    const {signInWithGoogle, signInWithApple} = useAuth()

    async function handleSingInWithGoogle() {
        try {
            setIsLoading(true)
            await signInWithGoogle()
        } catch (e: any) {
            console.log("ERROR " + e)
            Alert.alert('Nao  foi possivel conectar a conta Google')
        }
        setIsLoading(false)
    }

    async function handleSingInWithApple() {
        try {
            setIsLoading(true)
            await signInWithApple()
        } catch (e: any) {
            console.log("ERROR " + e)
            Alert.alert('Nao  foi possivel conectar a conta Apple')
        }
        setIsLoading(false)
    }

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />
                    <Title>
                        Controle suas {`\n`}financas de forma {`\n`} muito simples
                    </Title>
                </TitleWrapper>
                <SignInTitle>
                    Faça seu login com {`\n`}uma das contas abaixo
                </SignInTitle>
            </Header>

            <Footer>
                <FooterWrapper>
                    <SignInSocialButton
                        title={"Entrar com Google"}
                        svg={GoogleSvg}
                        onPress={handleSingInWithGoogle}
                    />

                    {
                        Platform.OS == "ios" &&
                        <SignInSocialButton
                            title={"Entrar com Apple"}
                            svg={AppleSvg}
                            onPress={handleSingInWithApple}
                        />
                    }
                </FooterWrapper>
                {isLoading && <ActivityIndicator
                    color={theme.colors.shape}
                    style={{marginTop: 18}}
                />}
            </Footer>

        </Container>
    )
}