import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@aws-amplify/ui-react'
import ColumnFlex from '../../components/ColumnFlex'

interface OwnProps {
}

type Props = OwnProps;

const Home: FunctionComponent<Props> = (props) => {
    return (
        <ColumnFlex>
            <Link to="/broadcast" style={{marginBottom: "15px"}}>
                <Button>
                    방송하러 가기
                </Button>
            </Link>
            <Link to="/map">
                <Button>
                    지도
                </Button>
            </Link>
        </ColumnFlex>
    )
}

export default Home
