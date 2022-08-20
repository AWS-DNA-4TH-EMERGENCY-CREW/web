import React, { FunctionComponent, ReactNode } from 'react'

interface OwnProps {
    children: ReactNode
}

type Props = OwnProps;

const ColumnFlex: FunctionComponent<Props> = ({ children }) => {
    return (
        <div style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: '100%'
        }}>
            {children}
        </div>
    )
}

export default ColumnFlex
