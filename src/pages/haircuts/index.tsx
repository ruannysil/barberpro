import { Sidebar } from "@/src/components/sidebar";
import { Button, Flex, Heading, Text, Stack, Switch, useMediaQuery, useToast } from "@chakra-ui/react";
import Head from "next/head";
import Link from 'next/link'
import { IoMdPricetag } from 'react-icons/io'

import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { setupAPIClient } from "@/src/services/api";
import { ChangeEvent, useState } from 'react';

interface HaicutsItem {
    id: string;
    name: string;
    price: number | string;
    status: boolean;
    user_id: string;
}

interface HaircutsProps {
    haircuts: HaicutsItem[];
}


export default function Haircuts({ haircuts }: HaircutsProps) {

    const [isMobile] = useMediaQuery("(max-width: 500px)")

    const [haircutList, setHaircutList] = useState<HaicutsItem[]>(haircuts || [])
    const [disableHaircut, setDisableHaircut] = useState("enabled")
    const [isDisabled, setIsDisabled] = useState(false);
    const toast = useToast();

    async function handleDisable(e: ChangeEvent<HTMLInputElement>) {
        setIsDisabled(!isDisabled)
        const apiClient = setupAPIClient();

        if (e.target.value === "disabled") {
            setDisableHaircut("enabled");
            toast({
                title: "Sucesso!",
                description: "Tabela de Cortes ativados!",
                status: "success",
                duration: 5000,
                position: "bottom-right",
                isClosable: true
            })
            const response = await apiClient.get('/haircuts', {
                params: {
                    status: true,
                }
            })

            setHaircutList(response.data);
        } else {
            setDisableHaircut("disabled")
            toast({
                title: "Error!",
                description: "Tabela de Cortes desativados!",
                status: "error",
                duration: 5000,
                position: "bottom-right",
                isClosable: true
            })

            const response = await apiClient.get('/haircuts', {
                params: {
                    status: false,
                }
            })
            setHaircutList(response.data)
        }
    }

    return (
        <>
            <Head>
                <title>Modelos de cortes - Minha barbearia</title>
            </Head>
            <Sidebar>
                <Flex direction={'column'} alignItems={'flex-start'} justifyContent={'flex-start'} >

                    <Flex
                        direction={isMobile ? 'column' : 'row'}
                        w={'100%'}
                        alignItems={isMobile ? 'flex-start' : 'center'}
                        justifyContent={'flex-start'}
                        mb={0}
                    >
                        <Heading
                            fontSize={isMobile ? '25px' : '2xl'}
                            mt={4}
                            mb={4}
                            mr={4}
                            color={'orange.900'}
                        >
                            Modelos de Cortes
                        </Heading>

                        <Link href={'/haircuts/new'}>
                            <Button bg={'button.gray'} color={"#fff"} _hover={{ bg: 'button.cta' }}>
                                Cadastra novo
                            </Button>
                        </Link>

                        <Stack ml={'auto'} align={'center'} direction={'row'}>
                            <Text fontWeight={'bold'}>
                                {haircutList.length === 1 ? (isDisabled ? "Corte Desativado" : "Corte Ativado") : (isDisabled ? "Cortes Desativados" : "Cortes Ativados")}
                            </Text>
                            <Switch colorScheme={'green'} size={'lg'} value={disableHaircut} onChange={(e) => handleDisable(e)} isChecked={disableHaircut === 'disabled' ? false : true} />
                        </Stack>

                    </Flex>

                    {haircutList.map(haircut => (

                        <Link key={haircut.id} href={`/haircuts/${haircut.id}`} className="full-width-link" style={{ width: '100%' }}>
                            <Flex
                                cursor="pointer"
                                width="100%"
                                p={4}
                                bg="barber.400"
                                direction={isMobile ? "column" : "row"}
                                alignItems={isMobile ? "flex-start" : "center"}
                                rounded={4}
                                mb={2}
                                justifyContent="space-between"
                            >
                                <Flex mb={isMobile ? 2 : 0} direction={'row'} alignItems={'center'} justifyContent={'center'}>
                                    <IoMdPricetag size={28} color="#fba931" />
                                    <Text fontWeight={'bold'} noOfLines={2}>
                                        {haircut.name}
                                    </Text>
                                </Flex>

                                <Text fontWeight={'bold'}>Preço: R$ {haircut.price}</Text>
                            </Flex>
                        </Link>
                    ))}

                </Flex>
            </Sidebar>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {

        const apiClient = setupAPIClient(ctx)
        const response = await apiClient.get('/haircuts', {
            params: {
                status: true,
            }
        })

        if (response.data === null) {
            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false,
                }
            }
        }

        return {
            props: {
                haircuts: response.data
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