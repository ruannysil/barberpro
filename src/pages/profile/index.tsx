import Head from "next/head";
import { Flex, Text, Heading, Box, Input, Button, useToast, Spinner } from "@chakra-ui/react";
import { Sidebar } from "@/src/components/sidebar";

import Link from "next/link";
import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { AuthContext } from "@/src/content/AuthContext";
import { useContext, useState } from 'react';
import { setupAPIClient } from "@/src/services/api";

interface UserProps {
    id: string;
    name: string;
    email: string;
    endereco: string | null;
}

interface ProfileProps {
    user: UserProps;
    premium: boolean;
}

export default function Profile({ user, premium }: ProfileProps) {
    const { logoutUser } = useContext(AuthContext)
    const toast = useToast();
    const [name, setName] = useState(user && user.name);
    const [endereco, setEndereco] = useState(user && user?.endereco);
    const [saving, setSaving] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    async function handleLogout() {
        setLoggingOut(true)

        try {
            await logoutUser();
            toast({
                title: "Sucesso!",
                description: "Endereço salvo com sucesso!.",
                status: "success",
                duration: 5000,
                position: 'top-right',
                isClosable: true,
            });

            setLoggingOut(false)

        } catch (error) {
            toast({
                title: "Erro!",
                description: "Ocorreu um erro ao sair!.",
                status: "error",
                duration: 5000,
                position: 'top-right',
                isClosable: true,
            });
        }
        setLoggingOut(false)
    }

    async function handleUpdateUser() {

        if (name === '') {
            return;
        }

        setSaving(true)

        try {
            const apiClient = setupAPIClient();
            await apiClient.put('/users', {
                name: name,
                endereco: endereco,
            })


            toast({
                title: "Sucesso!",
                description: "Endereço salvo com sucesso!.",
                status: "success",
                duration: 5000,
                position: 'top-right',
                isClosable: true,
            });

            setSaving(false)

        } catch (err) {
            toast({
                title: "Erro!",
                description: "Error ao salvar Endereço!.",
                status: "error",
                duration: 5000,
                position: 'top-right',
                isClosable: true,
            });
            setSaving(false)
        }

    }

    return (
        <>
            <Head>
                <title>Minha conta - BarberPRO</title>
            </Head>
            <Sidebar>
                <Flex direction={"column"} alignItems={"flex-start"} justifyContent={"flex-start"}>
                    <Flex w={"100%"} direction={"row"} alignItems={"center"} justifyContent={"flex-start"}>
                        <Heading fontSize={"2xl"} mt={"4"} mb={"4"} color={"orange.900"}>
                            Minha conta
                        </Heading>
                    </Flex>

                    <Flex
                        pt={8}
                        pb={8}
                        bg={"barber.400"}
                        maxW={700}
                        w={"100%"}
                        direction={"column"}
                        alignItems={"center"}
                        rounded={6}
                        justifyContent={"center"}
                    >
                        <Flex direction={"column"} w={"85%"}>

                            <Text mb={2} fontSize={"xl"} fontWeight={"bold"}>
                                Nome da barbearia:
                            </Text>
                            <Input
                                w={"100%"}
                                bg={"gray.900"}
                                placeholder="Nome da sua barbearia"
                                borderColor={"button.gray"}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <Text mb={2} fontSize={"xl"} fontWeight={"bold"}>
                                Endereço:
                            </Text>
                            <Input
                                w={"100%"}
                                bg={"gray.900"}
                                placeholder="Nome da sua barbearia"
                                borderColor={"button.gray"}
                                value={endereco}
                                onChange={(e) => setEndereco(e.target.value)}
                            />

                            <Text mb={2} fontSize={"xl"} fontWeight={"bold"}>
                                Plano atual:
                            </Text>

                            <Flex
                                direction={'row'}
                                w={'100%'}
                                mb={3}
                                p={1}
                                borderWidth={1}
                                borderColor={`rgba(128, 128, 128, 0.5)`}
                                background={'barber.900'}
                                rounded={6}
                                alignItems={'center'}
                                justifyContent={'space-between'}
                            >

                                <Text p={2} fontSize={'lg'} color={premium ? '#Fba931' : '#4dffb4'}>Plano {premium ? 'Premium' : 'Gratis'}</Text>

                                <Link href='/planos'>
                                    <Box cursor={'pointer'} p={1} pl={2} pr={2} bg={'#00cd52'} _hover={{ bg: "#0b7033" }} rounded={4} mr={2} >
                                        Mudar plano
                                    </Box>
                                </Link>

                            </Flex>

                            <Button
                                w={'100%'}
                                mt={3}
                                mb={4}
                                bg={'button.cta'}
                                color={'button.default'}
                                _hover={{ bg: '#ffb23eb3' }}
                                onClick={handleUpdateUser}
                                disabled={saving}
                            >
                                {saving ? (
                                    <Spinner size={"md"} color="#fff" />
                                ) : (
                                    "Salvar"
                                )}
                            </Button>

                            <Button
                                w={'100%'}
                                mb={4}
                                borderWidth={1}
                                borderColor={'red.500'}
                                bg={'#ffffffff'}
                                color={'red.500'}
                                _hover={{ bg: '#db311bb3', color: '#fff' }}
                                onClick={handleLogout}
                                disabled={loggingOut}
                            >
                                {loggingOut ? (
                                    <Spinner size={"md"} color="#070404" />
                                ) : (
                                    "Sair da conta"
                                )}
                            </Button>

                        </Flex>
                    </Flex>
                </Flex>
            </Sidebar >
        </>
    );
}


export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/me')

        const user = {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            endereco: response.data?.endereco
        }

        return {
            props: {
                user: user,
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
