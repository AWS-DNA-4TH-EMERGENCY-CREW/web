import React, { FunctionComponent, useEffect, useState } from 'react'
import useDevices from '../../hook/UseDevices'
import { ChannelInfo, createChannelAPI, stopBroadcastAPI } from '../../api/Broadcast'
import Loader from '../../components/Loader'
import { BoldText } from '../../components/Text'
import useGeolocation from 'react-hook-geolocation'
import ColumnFlex from '../../components/ColumnFlex'
import Error from '../../components/Error'
import Preview from './Preview'
import { createClient } from '../../utils/IVSClient'
// @ts-ignore
import IVSBroadcastClient from 'amazon-ivs-web-broadcast'
import { Button } from '@aws-amplify/ui-react'
import { useNavigate, useSearchParams } from 'react-router-dom'

interface OwnProps {
}

type Props = OwnProps;

function SimpleLoader ({ message }: { message: string }) {
    return (
        <ColumnFlex>
            <Loader />
            <BoldText>{message}</BoldText>
        </ColumnFlex>
    )
}

function SimpleError ({ message, errorMessage }: { message: string, errorMessage: string }) {
    return (
        <Error>
            <BoldText>
                <div style={{ textAlign: 'center' }}>
                    {message}
                    <br />
                    {errorMessage}
                </div>
            </BoldText>
        </Error>
    )
}

const streamConfig = IVSBroadcastClient.BASIC_LANDSCAPE

const Broadcast: FunctionComponent<Props> = (props) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()

    const title = searchParams.get('titleName') ?? "제목 없음"

    const [client, setClient] = useState<any | null>(null)

    const [isDeviceLoading, getDeviceError, getDeviceStream] = useDevices()
    const [isDeviceInit, initDevice] = useState(false)

    const geo = useGeolocation()

    const [channelLoading, setChannelLoading] = useState(false)
    const [channelError, setChannelError] = useState<any | null>(null)
    const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null)

    const [isBroadcastLoading, setBroadcastLoading] = useState(false)
    const [isBroadcasting, setIsBroadcasting] = useState(false)

    useEffect(() => {
        if (geo.error != null || geo.latitude == null) {
            return
        }

        setChannelLoading(true)
        createChannelAPI({ lat: `${geo.latitude}`, long: `${geo.longitude}`, channelName: Date.now().toString(), channelTitle: title })
            .then(c => {
                setChannelInfo(c)
                setChannelError(null)
                setClient(createClient(c.ingestEndpoint))
            })
            .catch(e => {
                setChannelInfo(null)
                setChannelError(e)
            })
            .finally(() => {
                setChannelLoading(false)
            })
    }, [geo.error, geo.latitude, geo.longitude, title])

    useEffect(() => {
        if (channelInfo == null || isDeviceInit || client == null) {
            return
        }
        (async () => {
            console.log('getDeviceStream call', isDeviceInit)
            const deviceStream = await getDeviceStream(streamConfig)
            console.log('getDeviceStream', deviceStream)
            if (deviceStream != null) {
                console.log('attach stream to client')
                client.addVideoInputDevice(deviceStream.cameraStream, 'camera1', { index: 0 }) // only 'index' is required for the position parameter
                client.addAudioInputDevice(deviceStream.microphoneStream, 'mic1')
                initDevice(true)
            }
        })()
    }, [client, getDeviceStream, isDeviceInit, channelInfo])

    const startBroadcast = () => {
        if (client == null || channelInfo == null) {
            return
        }
        setBroadcastLoading(true)
        client.startBroadcast(channelInfo.streamKey)
            .then(() => {
                console.log('I am successfully broadcasting!')
                setIsBroadcasting(true)
            })
            .catch((error: any) => {
                console.error('Something drastically failed while broadcasting!', error)
                setIsBroadcasting(false)
            })
            .finally(() => {
                setBroadcastLoading(false)
            })
    }

    const stopBroadcast = () => {
        if (client == null || channelInfo == null) {
            return
        }
        client.stopBroadcast()
        setIsBroadcasting(false)
        stopBroadcastAPI(channelInfo.channelName)
            .then(() => {
                navigate('/', { replace: true })
            })
            .catch((err) => {
                console.error(err)
            })
    }

    if (geo.latitude == null && geo.error == null) {
        return <SimpleLoader message="GPS 정보 초기화중" />
    }

    if (geo.error != null) {
        return <SimpleError message="위치를 얻어오는데 실패했습니다" errorMessage={geo.error.message} />
    }

    if (channelLoading) {
        return <SimpleLoader message="채널 생성 중" />
    }

    if (channelError != null) {
        return <SimpleError message="채널을 생성하는데 실패했습니다" errorMessage={channelError.message} />
    }

    if (client == null) {
        return <SimpleLoader message="클라이언트 초기화 중" />
    }

    if (isDeviceLoading) {
        return <SimpleLoader message="디바이스 정보를 불러오는 중" />
    }

    if (getDeviceError != null) {
        return <SimpleError message="디바이스 정보를 얻어오는데 실패했습니다" errorMessage={getDeviceError.message} />
    }

    return (
        <div>
            <ColumnFlex>
                <Preview client={client} />
                {isBroadcasting && (
                    <Button style={{ marginTop: '15px' }} onClick={stopBroadcast}>방송 중지</Button>
                )}
                {!isBroadcasting && isBroadcastLoading && (
                    <Button style={{ marginTop: '15px' }} disabled>방송 시작 중</Button>
                )}
                {!isBroadcasting && !isBroadcastLoading && (
                    <Button style={{ marginTop: '15px' }} onClick={startBroadcast}>방송 시작</Button>
                )}
            </ColumnFlex>
        </div>
    )
}

export default Broadcast
