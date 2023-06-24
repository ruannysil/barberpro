import Head from "next/head";
import {
    Button,
    Flex,
    Heading,
    Text,
    Spinner,
    useMediaQuery
} from '@chakra-ui/react'

import { Sidebar } from "@/src/components/sidebar";
import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { setupAPIClient } from "@/src/services/api";
import { getStripeJs } from "@/src/services/stripe-js";
import { useState } from "react";

interface PlanosProps {
    premium: boolean;
}

export default function Planos({ premium }: PlanosProps) {
    const [isMobile] = useMediaQuery('(max-width: 500px)')
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        if (premium) {
            return;
        }

        try {
            setLoading(true);
            const apiClient = setupAPIClient()
            const response = await apiClient.post("/subscribe")

            const { sessionId } = response.data;

            const stripe = getStripeJs();
            (await stripe).redirectToCheckout({ sessionId: sessionId })
        }
        catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    }

    async function handleCreatePortal() {

        try {

            if (!premium) {
                return;
            }

            const apiClient = setupAPIClient();
            const response = await apiClient.post("/create-portal")

            const { sessionId } = response.data;

            window.location.href = sessionId

        } catch (err) {
            console.log(err.message)
        }
    }

    return (
        <>
            <Head>
                <title>Barber Pro - Sua assinatura Premium</title>
            </Head>
            <Sidebar>
                <Flex w="100%" direction="column" align="flex-start" justify="flex-start">
                    <Heading fontSize="3xl" mt={4} mb={4} mr={4}>
                        Planos
                    </Heading>
                </Flex>

                <Flex pb={8} maxW="780px" w="100%" direction="column" align="flex-start" justify="flex-start">

                    <Flex gap={4} w="100%" flexDirection={isMobile ? "column" : "row"}>

                        <Flex rounded={4} p={2} flex={1} bg={"barber.400"} flexDirection="column">
                            <Heading
                                textAlign="center"
                                fontSize="2xl"
                                mt={2}
                                mb={2}
                            >
                                Plano Grátis
                            </Heading>

                            <Text fontWeight={"medium"} ml={4} mb={2}>Registrar cortes.</Text>
                            <Text fontWeight={"medium"} ml={4} mb={2}>Criar apenas 3 modelos de corte.</Text>
                            <Text fontWeight={"medium"} ml={4} mb={2}>Editar dados do perfil.</Text>
                        </Flex>

                        <Flex rounded={4} p={2} flex={1} bg={"barber.400"} flexDirection="column">
                            <Heading
                                textAlign="center"
                                fontSize="2xl"
                                mt={2}
                                mb={2}
                                color={"#31fb6a"}
                            >
                                Premium
                            </Heading>

                            <Text fontWeight="medium" ml={4} mb={2}>Registrar cortes ilimitados.</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>Criar modelos ilimitados.</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>Editar modelos de corte.</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>Editar dados do perfil.</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>Receber todas atualizações.</Text>
                            <Text fontWeight={"bold"} ml={4} mb={2} color={"#31fb6a"}>R$: 9.99</Text>



                            <Button
                                bg={premium ? "transparent" : "button.cta"}
                                m={2}
                                color={premium ? "button.cta" : "button.default"}
                                _hover={{
                                    bg: premium ? "none" : "orange.500",
                                    color: premium ? "none" : "#000"
                                }}
                                disabled={premium}
                                cursor={premium ? "not-allowed" : "pointer"}
                                onClick={handleSubscribe}
                            >
                                {loading ? (
                                    <Spinner size={"md"} color="#fff" />
                                ) : (
                                    premium ? "VOCÊ JÁ É PREMIUM" : "VIRAR PREMIUM"
                                )
                                }
                            </Button>

                            {premium && (
                                <Button
                                    m={2}
                                    bg={"button.default"}
                                    color={"barber.400"}
                                    fontWeight={"bold"}
                                    onClick={handleCreatePortal}
                                >
                                    ALTERAR ASSINATURAR
                                </Button>
                            )}

                        </Flex>

                    </Flex>

                </Flex>

            </Sidebar>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/me')

        console.log(response.data?.subscriptions?.status)

        return {
            props: {
                premium: response.data?.subscriptions?.status === 'active' ? true : false
            }
        }

    } catch (err) {
        console.log(err)

        return {
            redirect: {
                destination: '/dashboard',
                permanent: false
            }
        }
    }

})