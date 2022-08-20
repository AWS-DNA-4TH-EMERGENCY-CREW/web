import React, { FunctionComponent, ReactNode } from 'react'

type Props = {
    children: ReactNode
}

const Text: FunctionComponent<Props> = ({ children }: Props) => {
    return (
        <div style={{ fontWeight: 'normal' }}>
            {children}
        </div>
    )
}

const BoldText: FunctionComponent<Props> = ({ children }: Props) => {
    return (
        <div style={{ fontWeight: 'bold' }}>
            {children}
        </div>
    )
}

export { Text, BoldText }
