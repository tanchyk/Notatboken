import {NextPage} from "next";
import {withApollo} from "../../utils/withApollo";
import {useRouter} from "next/router";
import {useConfirmRegistrationMutation} from "../../generated/graphql";
import {useEffect} from "react";
import {useToast} from "@chakra-ui/react";

interface ConfirmEmail {
    token: string;
}

const ConfirmEmail: NextPage<ConfirmEmail> = ({token}) => {
    const router = useRouter();
    const toast = useToast();

    const [confirmRegistration] = useConfirmRegistrationMutation();

    const sendLoginRequest = async (tokenStr: string) => {
        const response = await confirmRegistration({variables: {token: tokenStr}});

        if(response.data?.confirmRegistration.errors) {
            toast({
                position: 'bottom',
                title: "Error!",
                description: response.data?.confirmRegistration.errors[0].message,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            return router.push('/confirm-email/send-request');
        } else {
            toast({
                position: 'bottom',
                title: "Confirmed!",
                description: "Your email is confirmed, you can login now",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            return router.push('/login');
        }
    }

    useEffect(() => {
        sendLoginRequest(token);
    }, [])

    return (
        <></>
    );
}

ConfirmEmail.getInitialProps = ({query}) => {
    return {
        token: query.token as string
    }
}

// @ts-ignore
export default withApollo({ssr: false})(ConfirmEmail);