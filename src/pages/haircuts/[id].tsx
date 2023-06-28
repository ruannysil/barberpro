import { Text, Flex, Button, Heading, useMediaQuery, Input, Stack, Switch, Spinner, useToast } from '@chakra-ui/react';
import Head from "next/head";
import { Sidebar } from "@/src/components/sidebar";

import Link from "next/link";

import { FiChevronLeft } from 'react-icons/fi'

import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { setupAPIClient } from "@/src/services/api";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";

interface HaircutProps {
    id: string;
    name: string;
    price: string | number;
    status: boolean;
    user_id: string;
}

interface SubscriptionProps {
    id: string;
    status: string;
}

interface EditHaircutProps {
    haircut: HaircutProps;
    subscription: SubscriptionProps | null;
}





export default function EditHaircut({ haircut, subscription }: EditHaircutProps) {
    const [isMobile] = useMediaQuery("(max-width: 500px)")

    const [name, setName] = useState(haircut?.name)
    const [price, setPrice] = useState(haircut?.price)
    const [status, setStatus] = useState(haircut?.status)
    const [loading, setLoading] = useState(false)
    const toast = useToast();

    const [disableHaircut, setDisableHaircut] = useState(haircut?.status ? 'disabled' : 'enabled')
    console.log(disableHaircut)

    const router = useRouter()

    // console.log(haircut) mostra todos os corte disponivel para editar


    function handleChangeStatus(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.value === 'disabled') {
            setDisableHaircut('enabled');
            setStatus(false);
            toast({
                title: "Error!",
                description: "Corte desabilitado da tabela!",
                status: "error",
                duration: 5000,
                position: "top-right",
                isClosable: true
            })
        } else {
            setDisableHaircut('disabled');
            setStatus(true);
            toast({
                title: "Sucesso!",
                description: "Corte habilitado a tabela!",
                status: "success",
                duration: 5000,
                position: "top-right",
                isClosable: true
            })
        }
    }


    async function handleUpdate() {
        console.log({
            name,
            price,
            status
        })
        if (name === '' || price === '') {
            toast({
                title: "Erro!",
                description: "Por favor, preencha os campos de nome e valor",
                status: "error",
                duration: 5000,
                position: "top-right",
                isClosable: true,
            })
            return;
        }

        setLoading(true);

        try {
            const apiClient = setupAPIClient();
            await apiClient.put('/haircut', {
                name: name,
                price: Number(price),
                status: status,
                haircut_id: haircut?.id
            })

            router.push('/haircuts')

            toast({
                title: "Sucesso!",
                description: "As alterações foram salvas com sucesso!",
                status: "success",
                duration: 5000,
                position: "top-right",
                isClosable: true,
            })

        } catch (err) {
            console.log("Ocorreu um erro ao atualizar os dados", err)
            toast({
                title: "Erro!",
                description: "Ocorreu um erro ao atualizar os dados!",
                status: "error",
                duration: 5000,
                position: "top-right",
                isClosable: true,
            })
        }

        setLoading(false)
    }

    return (
        <>
            <Head>
                <title>Editando modelo de corte - BarberPro</title>
            </Head>
            <Sidebar>

                <Flex direction={"column"} alignItems={"flex-start"} justifyContent={"flex-start"}>

                    <Flex
                        direction={isMobile ? "column" : "row"}
                        w={"100%"}
                        alignItems={isMobile ? "flex-start" : "center"}
                        justifyContent={"flex-start"}
                        mb={isMobile ? 4 : 0}
                    >

                        <Link href={'/haircuts'}>
                            <Button
                                bg={'button.gray'}
                                color={"#fff"}
                                _hover={{ bg: 'button.cta' }}
                                p={4}
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                mr={4}>
                                <FiChevronLeft size={24} />
                                Voltar
                            </Button>
                        </Link>

                        <Heading
                            fontSize={isMobile ? '25px' : '2xl'}
                            mt={4}
                            mb={4}
                            mr={4}
                        >
                            Editar Corte
                        </Heading>
                    </Flex>

                    <Flex mt={4} maxW={700} p={4} w={"100%"} bg={"barber.400"} direction={"column"} align={"center"} justify={"center"} >
                        <Heading fontSize={isMobile ? "22px" : "3xl"}>
                            Editar corte
                        </Heading>

                        <Flex w={"85%"} direction={"column"}>
                            <Input
                                placeholder="Nome do corte"
                                bg={"gray.900"}
                                mb={3}
                                mt={3}
                                size={"lg"}
                                type="text"
                                w={"100%"}
                                borderColor={"button.gray"}
                                disabled={subscription?.status !== 'active'}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <Input
                                placeholder="Valor do corte"
                                bg={"gray.900"}
                                mb={3}
                                mt={3}
                                size={"lg"}
                                type="number"
                                w={"100%"}
                                borderColor={"button.gray"}
                                disabled={subscription?.status !== 'active'}
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />

                            <Stack mb={6} align={"center"} direction={"row"}>
                                <Text fontWeight={"bold"}>Desativar corte</Text>
                                <Switch
                                    size={"lg"}
                                    colorScheme="red"
                                    value={disableHaircut}
                                    isChecked={disableHaircut === 'disabled' ? false : true}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeStatus(e)}
                                />
                            </Stack>

                            <Button
                                mb={8}
                                w={"100%"}
                                bg={"button.cta"}
                                color={"gray.900"}
                                _hover={{ bg: "orange.500", color: "#fff" }}
                                disabled={subscription?.status !== 'active'}
                                cursor={subscription?.status !== 'active' ? "not-allowed" : "pointer"}
                                onClick={handleUpdate}
                                isDisabled={loading}
                            >
                                {loading ?
                                    (<Spinner size={"md"} color='#fff' />) :
                                    ("Salvar")
                                }
                            </Button>

                            {subscription?.status !== 'active' && (
                                <Flex direction={"row"} align={"center"} justify={"center"}>
                                    <Link href={"/planos"}>
                                        <Text cursor={"pointer"} color={"#31fb6a"} fontWeight={"bold"} mr={2}>
                                            Seja Premium
                                        </Text>
                                    </Link>
                                    <Text>
                                        e tenha todos acessos liberados
                                    </Text>
                                </Flex>
                            )}


                        </Flex>

                    </Flex>

                </Flex>


            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const { id } = ctx.params;
    // console.log(id)

    try {
        const apiClient = setupAPIClient(ctx);
        const check = await apiClient.get('/haircut/check')
        const response = await apiClient.get('/haircut/detail', {
            params: {
                haircut_id: id,
            }
        })

        // console.log(response.data)

        return {
            props: {
                haircut: response.data,
                subscription: check.data?.subscriptions
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