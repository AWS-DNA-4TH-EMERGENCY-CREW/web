import { ThreeDots } from 'react-loader-spinner'
import React from 'react'

function Loader () {
    return (
        <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#4fa94d"
            ariaLabel="three-dots-loading"
            visible={true}
        />
    )
}

export default Loader
