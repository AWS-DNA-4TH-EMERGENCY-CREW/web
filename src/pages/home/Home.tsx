import React, { ChangeEvent, FunctionComponent, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, TextField } from '@aws-amplify/ui-react'
import ColumnFlex from '../../components/ColumnFlex'

interface OwnProps {
}

type Props = OwnProps;

const Home: FunctionComponent<Props> = (props) => {
    const [title, setTitle] = useState("")

    const changeTitle = (title: ChangeEvent<HTMLTextAreaElement>) => {
        setTitle(title.target.value)
    }

    return (
        <ColumnFlex>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
                <TextField size="small" fontSize="1rem" label="방송 이름" value={title} onChange={changeTitle}/>
                <Link to={`/broadcast?titleName=${title}`} style={{marginLeft: "10px", paddingTop: "18px"}}>
                    <Button>
                        방송하러 가기
                    </Button>
                </Link>
            </div>
            <Link to="/map">
                <Button>
                    지도
                </Button>
            </Link>
        </ColumnFlex>
    )
}

export default Home
