import Head from "next/head";
import { Flex, Heading, Button, useMediaQuery, Link as ChakraLink, Text, useDisclosure } from '@chakra-ui/react';


import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { Sidebar } from "@/src/components/sidebar";
import Link from 'next/link'

import { IoMdPerson } from 'react-icons/io'
import { setupAPIClient } from "@/src/services/api";
import { useState } from 'react';
import { ModalInfo } from "@/src/components/modal";

export interface ScheduleItem {
    id: string;
    customer: string;
    haircut: {
        id: string;
        name: string;
        price: string | number;
        user_id: string;
    }
}

interface DashboardProps {
    schedule: ScheduleItem[];
}

export default function Dashboard({ schedule }: DashboardProps) {
    const [isMobile] = useMediaQuery("(max-width: 500px)")
    const [list, setList] = useState(schedule)
    const [service, setService] = useState<ScheduleItem>()
    const { isOpen, onOpen, onClose } = useDisclosure();

    function handleOpenModal(item: ScheduleItem) {
        // console.log(item)
        setService(item)
        onOpen();
    }

    async function handleFinish(id: string) {
        // console.log(id)

        try {

            const apiClient = setupAPIClient();
            await apiClient.delete('/schedule', {
                params: {
                    schedule_id: id
                }
            })

            const filterItem = list.filter(item => {
                return (item?.id !== id)
            })

            setList(filterItem);
            onClose();


        } catch (err) {
            console.log("Erro ao finalizar Serviço", err)
        }
    }

    return (
        <>
            <Head>
                <title>Registrar cortes - Minha barbearia</title>
            </Head>
            <Sidebar>
                <Flex direction={"column"} align={"flex-start"} justify={"flex-start"}>
                    <Flex w={"100%"} direction={"row"} align={"center"} justifyContent={isMobile ? 'space-between' : 'flex-start'}>
                        <Heading
                            color={"orange.900"}
                            mt={4}
                            mb={4}
                            mr={4}
                            fontSize={isMobile ? "18px" : "2xl"}
                        >
                            Modelos de cortes
                        </Heading>
                        <Link href={'/new'}>
                            <Button
                                bg={'button.gray'}
                                color={"#fff"}
                                _hover={{ bg: 'button.cta' }}
                                p={4}
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                mr={4}
                                style={{ textDecoration: 'none' }}
                            >
                                Registrar
                            </Button>
                        </Link>
                    </Flex>


                    {list.map(item => (

                        <ChakraLink
                            onClick={() => handleOpenModal(item)}
                            key={item?.id}
                            w={"100%"}
                            p={0}
                            m={0}
                            mt={1}
                            bg={"transparent"}
                            style={{ textDecoration: "none" }}
                        >
                            <Flex
                                w={"100%"}
                                direction={isMobile ? "column" : "row"}
                                p={4}
                                rounded={4}
                                mb={4}
                                bg={"barber.400"}
                                justify={"space-between"}
                                align={isMobile ? "flex-start" : "center"}
                            >
                                <Flex direction={"row"} mb={isMobile ? 2 : 0} align={"center"} justify={"center"}>
                                    <IoMdPerson size={22} />
                                    <Text
                                        fontWeight={"bold"} ml={4}
                                        noOfLines={1}>{item?.customer}</Text>
                                </Flex>

                                <Text fontWeight={"bold"} mb={isMobile ? 2 : 0}>{item?.haircut?.name}</Text>
                                <Text fontWeight={"bold"}>R$ {item.haircut?.price}</Text>

                            </Flex>
                        </ChakraLink>
                    ))}

                </Flex>
            </Sidebar>

            <ModalInfo
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                data={service}
                finishService={async () => handleFinish(service?.id)}
            />

        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get("/schedule")

        return {
            props: {
                schedule: response.data,
            }
        }

    } catch (err) {
        console.log(err)
        return {
            props: {
                schedule: []
            }
        }
    }

})