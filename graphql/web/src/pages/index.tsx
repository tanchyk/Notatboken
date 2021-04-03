import React from "react";
import {Layout} from "../components/Layout";
import {withApollo} from "../utils/withApollo";

const Index: React.FC = () => {
    return (
        <Layout>
            <></>
        </Layout>
    )
}

export default withApollo({ssr: true})(Index);
