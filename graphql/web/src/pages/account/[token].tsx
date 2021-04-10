import {NextPage} from "next";
import {withApollo} from "../../utils/withApollo";
import {useRouter} from "next/router";
import {useConfirmEmailChangeMutation, useMeQuery} from "../../generated/graphql";
import {useEffect} from "react";
import {useToast} from "@chakra-ui/react";

interface ConfirmEmailChangeProps {
    token: string;
}

const ConfirmEmailChange: NextPage<ConfirmEmailChangeProps> = ({token}) => {
    const router = useRouter();
    const toast = useToast();

    const {data} = useMeQuery();
    const [confirmEmailChange] = useConfirmEmailChangeMutation();

    const sendEmailRequest = async (tokenStr: string) => {
        const response = await confirmEmailChange({variables: {token: tokenStr}});

        if(response.data?.confirmEmailChange.errors) {
            toast({
                position: 'bottom',
                title: "Error!",
                description: response.data?.confirmEmailChange.errors[0].message,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            return router.push('/account/basic-information');
        } else {
            toast({
                position: 'bottom',
                title: "Confirmed!",
                description: "Your email was changed.",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            return router.push('/');
        }
    }

    useEffect(() => {
        if(data?.me) {
            sendEmailRequest(token);
        }
    }, [data?.me])

    return (
        <></>
    );
}

ConfirmEmailChange.getInitialProps = ({query}) => {
    return {
        token: query.token as string
    }
}

// @ts-ignore
export default withApollo({ssr: false})(ConfirmEmailChange);