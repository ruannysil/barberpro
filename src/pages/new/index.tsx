import Head from "next/head";
import { Flex, Heading, useMediaQuery, Input, Select, Button, background } from '@chakra-ui/react';
import { Sidebar } from "@/src/components/sidebar";
import { useState, ChangeEvent } from 'react';

import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { setupAPIClient } from "@/src/services/api";

import { useRouter } from "next/router";

interface HaircutProps {
    id: string;
    name: string;
    price: string | number;
    status: boolean;
    user_id: string;
}

interface NewProps {
    haircuts: HaircutProps[];
}

export default function New({ haircuts }: NewProps) {
    const [isMobile] = useMediaQuery("(max-width: 500px)")

    const [customer, setCustomer] = useState('');
    const [haircutSelected, setHaircutSelected] = useState(haircuts[0])
    const router = useRouter()

    function handleSeleceted(id: string) {
        // console.log("nome do corte ", id)

        const haircutItem = haircuts.find(item => item.id);
        // console.log(haircutItem )

        setHaircutSelected(haircutItem);
    }

    async function handleRegister() {

        if (customer === '') {
            alert('Preencha o nome do Cliente')
            return;
        }

        try {
            const apiClient = setupAPIClient();
            await apiClient.post('/schedule', {
                customer: customer,
                haircut_id: haircutSelected?.id
            })

            router.push('/dashboard')

        } catch (err) {
            console.log("erro ao registrar ", err)
        }
    }

    return (


        <>
            <Head>
                <title>BarberPro - Novo agendamento</title>
            </Head>
            <Sidebar>
                <Flex direction={"column"} align={"flex-start"} justify={"flex-start"}>
                    <Flex
                        direction={"row"}
                        w={"100%"}
                        align={"center"}
                        justify={"flex-start"}
                    >
                        <Heading
                            color={"orange.900"}
                            mt={4}
                            mb={4}
                            mr={4}
                            fontSize={isMobile ? "18px" : "2xl"}
                        >
                            Novo Corte
                        </Heading>
                    </Flex>

                    <Flex
                        maxW={700}
                        pt={8}
                        pb={8}
                        w={"100%"}
                        direction={"column"}
                        align={"center"}
                        justify={"center"}
                        bg={"barber.400"}
                    >
                        <Input
                            placeholder="Nome do cliente"
                            bg={"gray.900"}
                            mb={3}
                            mt={3}
                            size={"lg"}
                            type="text"
                            w={"90%"}
                            borderColor={"button.gray"}
                            value={customer}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomer(e.target.value)}
                        />

                        <Select
                            mb={3}
                            size={"lg"}
                            w={"90%"}
                            bg={"gray.900"}
                            borderColor={"#dfdfdf3a"}
                            onChange={(e) => handleSeleceted(e.target.value)}
                        >
                            {haircuts?.map(item => (
                                <option key={item?.id} value={item?.id} style={{ background: "#1b1b29" }} >{item?.name}</option>
                            ))}
                        </Select>

                        <Button
                            mb={8}
                            w={"90%"}
                            bg={"button.cta"}
                            color={"gray.900"}
                            _hover={{ bg: "orange.500", color: "#fff" }}
                            onClick={handleRegister}
                        >
                            Cadastrar
                        </Button>

                    </Flex>

                </Flex>
            </Sidebar>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {

        const apiClient = setupAPIClient(ctx);
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

        // console.log(response.data);

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