import Head from 'next/head';
import { Flex, Text, Center, Button, Heading, useMediaQuery, styled } from '@chakra-ui/react';
import Image from 'next/image';
import LogoImg from '../../public/image/logo.svg';
import img1 from '../../public/image/barbeiro.jpg';
import img2 from '../../public/image/barber-4618697_1280.jpg';
import img3 from '../../public/image/cabelo-modelos.jpg';
import img4 from '../../public/image/corte.jpg';
import img5 from '../../public/image/Foto-redimencionada-.jpg';
import img6 from '../../public/image/tste.jpeg';
import img7 from '../../public/image/haircut-4019676_640.jpg';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import SwiperCore, { Navigation, Pagination } from 'swiper';


SwiperCore.use([Navigation, Pagination]);

export default function Home() {
  const [isMobile] = useMediaQuery("(max-width: 500px)");

  return (
    <>
      <Head>
        {/* ...código anterior do Head... */}
      </Head>
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Flex width={640} direction="column" p={5} rounded={8}>
          <Center>
            <Image src={LogoImg} quality={100} objectFit="fill" alt="logo barberPro" />
          </Center>

          <Flex maxW="780px" w="100%" direction="column" align="flex-start" justify="flex-start">
            <Flex gap={4} w="100%" flexDirection={isMobile ? "column" : "row"}>
              <Flex flexDirection="column">
                <Heading textAlign="center" fontSize="2xl" mt={2} mb={2}>
                  Melhor Sistema para barbearia, venha conferir
                </Heading>

                <Flex justifyContent="center" mb={4}>
                  <Swiper
                    slidesPerView={'auto'}
                    spaceBetween={10}
                    // navigation
                    pagination={{ clickable: true }}
                    // autoplay={{delay: 1}}
                    loop={true}
                    className="mySwiper"

                  >
                    <SwiperSlide>
                      <Image src={img1} alt="img" className="swiper-image" />
                    </SwiperSlide>
                    <SwiperSlide>
                      <Image src={img2} alt="img" className="swiper-image" />
                    </SwiperSlide>
                    <SwiperSlide>
                      <Image src={img3} alt="img" className="swiper-image" />
                    </SwiperSlide>
                    <SwiperSlide>
                      <Image src={img4} alt="img" className="swiper-image" />
                    </SwiperSlide>
                    <SwiperSlide>
                      <Image src={img5} alt="img" className="swiper-image" />
                    </SwiperSlide>
                    <SwiperSlide>
                      <Image src={img6} alt="img" className="swiper-image" />
                    </SwiperSlide>
                    <SwiperSlide>
                      <Image src={img7} alt="img" className="swiper-image" />
                    </SwiperSlide>
                  </Swiper>
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          <Center textAlign={'center'}>
            <Text mb={5}>Ainda não possui conta? 👇👇👇👇</Text>
          </Center>

          <Link href="/register">
            <Button w="100%" background="button.cta" color="gray.900" mb={6} size="lg" _hover={{ bg: "#fac26e" }}>
              Cadastre-se
            </Button>
          </Link>

          <Center mt={2} textAlign={'center'}>
            <Link href={'/login'}>
              <Text color={'button.gray'} cursor={'pointer'} _hover={{ color: "#fff" }}>Já possui uma conta? <strong>Faça login</strong></Text>
            </Link>
          </Center>

        </Flex>
      </Flex>

      <style jsx>
        {`
          .swiper-button-next {
            color: #ff0; // cor amarela
          }

          .swiper-button-prev {
            color: #ff0000; // cor amarela
          }
        `}
      </style>
    </>
  );
}
