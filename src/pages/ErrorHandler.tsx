import { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";

interface ErrorHandlerProps {
    children: ReactNode;
}

function ErrorHandler({children}:ErrorHandlerProps) {
    const router = useRouter();

    useEffect(() => {
        const handleRouteChangeError = (url: string) => {
            if (url.startsWith('/_error')) {
                router.push("/login");
            }
        };

        router.events.on('routeChangeError', handleRouteChangeError);

        return () => {
            router.events.off('routeChangeError', handleRouteChangeError);
        };
    }, [])
    return <>{children}</>
}

export default ErrorHandler;