import { useState, useContext } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import LogoImg from '../../../public/image/logo.svg'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { Center, Flex, Input, InputGroup, InputRightElement, Button, Text, useToast, Spinner } from '@chakra-ui/react'
import Link from 'next/link'

import { AuthContext } from '@/src/content/AuthContext'
import { canSSRGuest } from '@/src/utils/canSSRGuest'


function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email)
}

export default function Login() {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const toast = useToast();

  const { signIn } = useContext(AuthContext)


  async function handleLogin() {

    if (!isValidEmail(email) || password === '') {
      toast({
        title: "Erro!",
        description: "Email ou senha incorretos.",
        status: "error",
        duration: 5000,
        position: 'top-right',
        isClosable: true
      })
      return;
    }

    setLoading(true)

    await signIn({
      email,
      password
    })

    setLoading(false);

    toast({
      title: "Sucesso!",
      description: "Dados preenchidos corretamente.",
      status: "success",
      duration: 5000,
      position: 'top-right',
      isClosable: true,
    });
  }
  return (
    <>
      <Head>
        <title>BarberPro - Login</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,700;1,900&display=swap" rel="stylesheet" />
      </Head>
      <Flex height="100vh" alignItems="center" justifyContent="center" >
        <Flex width={640} direction={'column'} p={5} rounded={8}>
          <Center>
            <Image
              src={LogoImg}
              quality={100}
              objectFit='fill'
              alt='logo barberPro' />
          </Center>

          <Input background={'barber.400'}
            variant={'filled'}
            _hover={{ bg: 'barber.400' }}
            size={'lg'}
            color={'button.default'}
            placeholder={'email'}
            type='text'
            mb={6}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputGroup>
            <Input background={'barber.400'}
              variant={'filled'}
              _hover={{ bg: 'barber.400' }}
              size={'lg'}
              color={'button.default'}
              placeholder={'senha'}
              type={show ? 'text' : 'password'}
              mb={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement height={'12'} marginRight={'1.5'}>
              <Button h={'2rem'} size={''} background={'transparent'} _hover={{ background: 'none' }} color={'button.default'} onClick={handleClick} >
                {show ? < FiEyeOff /> : < FiEye />}
              </Button>
            </InputRightElement>
          </InputGroup>

          <Button
            background={'button.cta'}
            color={'gray.900'}
            mb={6}
            size={'lg'}
            _hover={{ bg: "#fac26e" }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <Spinner size={"md"} color='#fff' />
            ) : (
              "Acessar"
            )}
          </Button>

          <Center mt={2}>
            <Link href={'/register'}>
              <Text color={'button.gray'} cursor={'pointer'} _hover={{ color: "#fff" }}>Ainda não possui conta? <strong>Cadastre-se</strong></Text>
            </Link>
          </Center>

        </Flex>
      </Flex>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {

    }
  }
})