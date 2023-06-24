import Head from "next/head";
import { Sidebar } from "@/src/components/sidebar";

import {
    Button,
    Flex,
    Heading,
    Input,
    Text,
    useMediaQuery
} from '@chakra-ui/react'
import Link from "next/link";
import { FiChevronLeft } from 'react-icons/fi'

import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { setupAPIClient } from '../../../services/api';
import { useState } from 'react';
import { useRouter } from "next/router";

interface NewHaircutProps {
    subscription: boolean;
    count: number;
}

export default function NewHaircut({ subscription, count }: NewHaircutProps) {
    const [isMobile] = useMediaQuery("(max-width: 500px)")

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const router = useRouter()

    async function handleRegister() {
        if (name === '' || price === '') {
            return;
        }

        try {

            const apiClient = setupAPIClient();
            await apiClient.post('/haircut', {
                name: name,
                price: Number(price),
            })

            router.push('/haircuts')

        } catch (err) {
            console.log('Erro ao cadastra esse modelo!', err)
        }

    }

    return (
        <>
            <Head>
                <title>BarberPRO - Novo modelo de corte</title>
            </Head>
            <Sidebar>
                <Flex direction={"column"} alignItems={"flex-start"} justifyContent={"flex-start"}>

                    <Flex
                        direction={isMobile ? "column" : "row"}
                        w={"100%"}
                        align={isMobile ? "flex-start" : "center"}
                        mb={isMobile ? 2 : 0}
                    >
                        <Link href={"/haircuts"} >

                            <Button
                                bg={'button.gray'}
                                color={"#fff"}
                                _hover={{ bg: 'button.cta' }}
                                p={4}
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                mr={4}
                            >
                                <FiChevronLeft size={24} color="#fff" />
                                Voltar
                            </Button>

                        </Link>

                        <Heading
                            color={"orange.900"}
                            mt={4}
                            mb={4}
                            mr={4}
                            fontSize={isMobile ? "28px" : "2xl"}
                        >
                            Modelos de cortes
                        </Heading>
                    </Flex>

                    <Flex
                        maxW={700}
                        bg={"barber.400"}
                        w={"100%"}
                        align={"center"}
                        justify={"center"}
                        pt={"8"}
                        pb={"8"}
                        direction={"column"}
                    >
                        <Heading fontSize={isMobile ? "22px" : "2xl"} mb={2}>Cadastrar modelo</Heading>

                        <Input
                            placeholder="Nomo do corte"
                            size={"lg"}
                            type="text"
                            w={"85%"}
                            borderColor={"button.gray"}
                            bg={"gray.900"}
                            mb={3}
                            disabled={!subscription && count >= 3}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <Input
                            placeholder="Valor do corte"
                            size={"lg"}
                            type="text"
                            w={"85%"}
                            borderColor={"button.gray"}
                            bg={"gray.900"}
                            mb={3}
                            disabled={!subscription && count >= 3}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <Button
                            onClick={handleRegister}
                            w={"85%"}
                            size={"lg"}
                            color={"gray.900"}
                            mb={6}
                            bg={"button.cta"}
                            _hover={{ bg: "orange.500" }}
                            disabled={!subscription && count >= 3}
                            cursor={!subscription && count >= 3 ? "not-allowed" : "pointer"}
                        >
                            Cadastrar
                        </Button>

                        {!subscription && count >= 3 && (
                            <Flex direction={"row"} align={"center"} justifyContent={"center"}>
                                <Text>Você atingiu seu limentes de cortes.</Text>
                                <Link href={'/planos'}>
                                    <Text fontWeight={"bold"} color={"#31fb6a"} cursor={"pointer"} ml={2}>Seja Premium</Text>
                                </Link>
                            </Flex>
                        )}

                    </Flex>

                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    try{
      const apiClient = setupAPIClient(ctx);
  
      const response = await apiClient.get('/haircut/check')
      const count = await apiClient.get('/haircut/count')
  
      return {
        props: {
          subscription: response.data?.subscriptions?.status === 'active' ? true : false,
          count: count.data
        }
      }
  
    }catch(err){
      console.log(err);
  
      return{
        redirect:{
          destination: '/dashboard',
          permanent:false,
        }
      }
    }
  
  })