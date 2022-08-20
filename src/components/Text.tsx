import React, { FunctionComponent, ReactNode } from 'react'

type Props = {
    children: ReactNode
}

const Text: FunctionComponent<Props> = ({ children }: Props) => {
    return (
        <div style={{ fontWeight: 'normal', whiteSpace: 'pre-wrap' }}>
            {children}
        </div>
    )
}

const BoldText: FunctionComponent<Props> = ({ children }: Props) => {
    return (
        <div style={{ fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>
            {children}
        </div>
    )
}

export { Text, BoldText }
