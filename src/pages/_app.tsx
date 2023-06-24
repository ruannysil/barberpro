import { CSSReset, ChakraProvider, extendTheme } from '@chakra-ui/react'
import { AuthProvider } from '../content/AuthContext'
import { Swiper } from 'swiper/react';

const colors = {
  barber: {
    900: '#12131b',
    400: '#1b1b29',
    100: '#c6c6c6',
  },
  button: {
    cta: '#fba931',
    default: '#fff',
    gray: '#dfdfdf3a',
    danger: '#ff4040'
  },
  orange: {
    900: '#fba931'
  }
}

const theme = extendTheme({
  colors,
  components: {
    Swiper: {
      baseStyle: {
        Navigation: {
          Tip: {
            bg: "#fba931",
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        backgroundColor: 'barber.900',
        height: '100vh',
        color: 'button.default'
      },
    },
  },
});

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
}
