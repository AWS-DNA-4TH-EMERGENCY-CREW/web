import React, { FunctionComponent, ReactNode } from 'react'
import { FcCancel } from 'react-icons/fc'
import ColumnFlex from './ColumnFlex'
import { BoldText } from './Text'

interface OwnProps {
    children: ReactNode
}

type Props = OwnProps;

const Error: FunctionComponent<Props> = ({ children }) => {
    return (
        <ColumnFlex>
            <FcCancel size="3rem" />
            <BoldText>
                {children}
            </BoldText>
        </ColumnFlex>
    )
}

export default Error
