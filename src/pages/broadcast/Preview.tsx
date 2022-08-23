import React, { FunctionComponent, useEffect, useRef } from 'react'

interface OwnProps {
    client: any
}

type Props = OwnProps;

const Preview: FunctionComponent<Props> = ({ client }) => {
    const preview = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        console.log('attach preview')
        client.attachPreview(preview.current)
    }, [client])

    return <canvas ref={preview} />
}

export default Preview
