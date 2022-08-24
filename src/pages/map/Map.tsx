import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Button, CheckboxField, Flex, MapView, TextField, View } from '@aws-amplify/ui-react'
import { MapRef, Marker, Popup } from 'react-map-gl'
import { MapboxEvent } from 'react-map-gl/src/types'
import { ChannelType, getCCTVProxyUrl, getChannelsAPI, PlayableChannelInfo } from '../../api/Map'
import ColumnFlex from '../../components/ColumnFlex'
import randomColor from 'randomcolor'
import { Link } from 'react-router-dom'
import cctv from '../../image/cctv.png'
import { BoldText } from '../../components/Text'
import Loader from '../../components/Loader'

type LatLng = {
    lat: number
    lng: number
}

type MarkerWithPopupProps = {
    onClick: (data: LatLng) => void
    key: string
    latitude: number
    longitude: number
    url: string
    channelName: string
    channelTitle: string
    thumbnailUrl?: string
    channelType: ChannelType
    startTime: Date
    endTime?: Date
}

const easeDurationInMs = 500

function difference2Parts (a: Date, b: Date) {
    const milliseconds = a.getTime() - b.getTime()
    const secs = Math.floor(Math.abs(milliseconds) / 1000)
    const mins = Math.floor(secs / 60)
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)
    const millisecs = Math.floor(Math.abs(milliseconds)) % 1000

    return {
        days: days,
        hours: hours % 24,
        hoursTotal: hours,
        minutesTotal: mins,
        minutes: mins % 60,
        seconds: secs % 60,
        secondsTotal: secs,
        milliSeconds: millisecs,
    }
}

function toString (date: Date): string {
    const now = new Date()
    const info = difference2Parts(now, date)

    if (info.days > 0) {
        date.setHours(date.getHours() + 9)
        return date.toISOString().replace('T', ' ').substring(0, 19)
    } else if (info.hours > 0) {
        return `${info.hours}시간 ${info.minutes}분 전`
    } else if (info.minutes > 0) {
        return `${info.minutes}분 ${info.seconds}초 전`
    } else {
        return date.toISOString().replace('T', ' ').substring(0, 19)
    }
}

type PopupProps = {
    onClose: () => void
    latitude: number
    longitude: number
    url: string
    channelTitle: string
    channelName: string
    channelType: ChannelType
    startTime: Date
    endTime?: Date
}

function SimpleLoader ({ message }: { message: string }) {
    return (
        <ColumnFlex>
            <Loader />
            <BoldText>{message}</BoldText>
        </ColumnFlex>
    )
}

function CustomPopup ({ url, channelName, channelTitle, channelType, startTime, endTime, latitude, longitude, onClose }: PopupProps) {
    // @ts-ignore
    const { IVSPlayer } = window
    const [ivsPlayer, setIvsPlayer] = useState<any | null>(null)

    const [now, setNow] = useState(new Date())
    const [startTimeStr, setStartTimeStr] = useState<string>(toString(startTime))
    const [endTimeStr, setEndTimeStr] = useState<string | null>(null)
    const video = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (IVSPlayer.isPlayerSupported) {
            if (ivsPlayer == null) {
                console.log('supported')
                const player = IVSPlayer.create()
                setIvsPlayer(player)
            }
        }
    }, [ivsPlayer, IVSPlayer])

    useEffect(() => {
        if (ivsPlayer == null || channelType === ChannelType.ENCODING) {
            return
        }
        ivsPlayer.attachHTMLVideoElement(video.current)
        if (true || channelType !== ChannelType.CCTV) {
            console.log('load url', url)
            ivsPlayer.load(url)
        } else {
            const splitResult = url.split('/')
            const fileName = splitResult[splitResult.length - 1]
            console.log({ url, fileName })

            const cctvProxyUrl = getCCTVProxyUrl(channelName, fileName)
            ivsPlayer.load(cctvProxyUrl)
            console.log('load cctvProxyUrl', cctvProxyUrl)
        }
        ivsPlayer.setMuted(false)
        // setTimeout(() => {
        ivsPlayer.play()
        console.log(ivsPlayer)
        console.log('player started')
        // }, 5000)

        return () => {
            ivsPlayer.pause()
            ivsPlayer.delete()
        }
    }, [channelName, channelType, ivsPlayer, url])

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date())
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])


    useEffect(() => {
        if (startTime != null) {
            setStartTimeStr(toString(startTime))
        }
        if (endTime != null) {
            setEndTimeStr(toString(endTime))
        }
    }, [endTime, now, startTime])

    return (
        <Popup
            maxWidth="85%"
            style={{ boxShadow: '0 20px 40px rgb(0 0 0 / 10%)', minWidth: '60%' }}
            latitude={latitude}
            longitude={longitude}
            offset={{ bottom: [0, -40] }}
            onClose={onClose}
        >
            <ColumnFlex>
                <div style={{ fontWeight: 'bold', fontSize: '1.3rem', padding: '5px 0 0 0', alignSelf: 'start' }}>{channelTitle}</div>
                {endTime == null && (
                    <div style={{ padding: '0 5px 0 0', alignSelf: 'start' }}>
                        <div style={{ color: '#7B6767', fontWeight: '300', fontSize: '0.6rem', }}>{startTimeStr} </div>
                    </div>
                )}
                {endTime != null && (
                    <div style={{ padding: '0 5px 0 0', alignSelf: 'start', display: 'flex' }}>
                        <div style={{ color: '#7B6767', fontWeight: '300', fontSize: '0.6rem' }}>{startTimeStr} </div>
                        <div style={{ color: '#7B6767', fontWeight: '300', fontSize: '0.6rem', padding: '0 5px' }}>~</div>
                        <div style={{ color: '#7B6767', fontWeight: '300', fontSize: '0.6rem' }}>{endTimeStr} </div>
                    </div>
                )}
                {channelType !== ChannelType.ENCODING ? (
                    <video ref={video} style={{ width: '100%', height: '100%', marginTop: '5px', maxHeight: '30vh' }} playsInline></video>
                ) : (
                    <div style={{ padding: '40px' }}>
                        <SimpleLoader message="영상 처리 중" />
                    </div>
                )}
            </ColumnFlex>
        </Popup>
    )
}


function MarkerWithPopup ({
                              latitude,
                              longitude,
                              url,
                              channelName,
                              channelTitle,
                              thumbnailUrl,
                              startTime,
                              endTime,
                              onClick,
                              channelType
                          }: MarkerWithPopupProps) {
    const [showPopup, setShowPopup] = useState(false)

    const handleMarkerClick = ({ originalEvent }: MapboxEvent<MouseEvent>) => {
        originalEvent.stopPropagation()
        onClick({
            lat: latitude,
            lng: longitude
        })
        setTimeout(() => {
            setShowPopup(true)
        }, easeDurationInMs)
    }

    return (
        <>
            {channelType === ChannelType.CCTV ? (
                <Marker
                    latitude={latitude}
                    longitude={longitude}
                    onClick={handleMarkerClick}
                    scale={0.8}
                    color={randomColor()}
                >
                    <img style={{ width: '21px', height: '100%' }}
                         src={cctv} alt="cctv" />
                </Marker>
            ) : (
                thumbnailUrl != null ? (
                    <Marker
                        latitude={latitude}
                        longitude={longitude}
                        onClick={handleMarkerClick}
                        scale={0.8}
                        color={randomColor()}
                    >
                        <img style={{ width: '100%', height: '100%', maxWidth: '5rem', maxHeight: '5rem' }}
                             src={thumbnailUrl} alt="test" />
                    </Marker>
                ) : (
                    <Marker
                        latitude={latitude}
                        longitude={longitude}
                        onClick={handleMarkerClick}
                        scale={0.8}
                        color={randomColor()}
                    />
                )
            )
            }
            {showPopup && (
                <CustomPopup onClose={() => setShowPopup(false)}
                             latitude={latitude} longitude={longitude}
                             url={url}
                             channelName={channelName}
                             channelTitle={channelTitle}
                             channelType={channelType}
                             startTime={startTime} endTime={endTime} />
            )}
        </>
    )
}

const optionToString = {
    [ChannelType.LIVE]: '라이브 방송',
    [ChannelType.CCTV]: 'CCTV',
    [ChannelType.VIDEO]: '저장된 영상',
    [ChannelType.ENCODING]: '처리 중인 영상',
    [ChannelType.TWITTER]: '트위터',
}

function Map () {
    const [locationData, setLocationData] = useState<PlayableChannelInfo[]>([])

    const [viewOption, setViewOption] = useState<Record<string, boolean>>({
        [ChannelType.LIVE]: true,
        [ChannelType.CCTV]: true,
        [ChannelType.VIDEO]: true,
        [ChannelType.ENCODING]: true,
        [ChannelType.TWITTER]: true,
    })
    const mapRef = useRef<MapRef>(null)

    const [title, setTitle] = useState('')

    const changeTitle = (title: ChangeEvent<HTMLTextAreaElement>) => {
        setTitle(title.target.value)
    }

    useEffect(() => {
        getChannelsAPI()
            .then(data => setLocationData(data))

        const interval = setInterval(() => {
            getChannelsAPI()
                .then(data => setLocationData(data))
        }, 30 * 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    const onClick = ({ lat, lng }: LatLng) => {
        mapRef.current?.easeTo({ center: { lng, lat }, duration: easeDurationInMs, zoom: 14 })
    }

    const onViewOptionClick = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.name)
        setViewOption({
            ...viewOption,
            [e.target.name]: e.target.checked
        })
    }

    return (
        <View>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '0.5rem', padding: '10px 5px 10px 5px' }}>
                {Object.values(ChannelType).map(type => (
                    <CheckboxField margin="5px 5px"
                                   key={type}
                                   label={optionToString[type]} name={type}
                                   value="yes"
                                   checked={viewOption[type]}
                                   onChange={onViewOptionClick} />
                ))}
            </div>
            <Flex direction={'column'} alignItems={'center'}>
                <MapView
                    ref={mapRef}
                    initialViewState={{
                        longitude: 127.06382476375357,
                        latitude: 37.495378727608546,
                        zoom: 12,
                    }}
                    style={{ width: '100%', height: 'calc(100vh - 98px)' }}
                >
                    {locationData
                        .filter(l => !isNaN(Number(l.lat)) && !isNaN(Number(l.long)))
                        .filter(l => {
                            for (const type of Object.values(ChannelType)) {
                                if (!viewOption[type] && l.channelType === type) return false
                            }
                            return true
                        })
                        .map((loc) => (
                            <MarkerWithPopup
                                onClick={onClick}
                                channelName={loc.channelName}
                                channelTitle={loc.channelTitle}
                                key={loc.playbackUrl + loc.lat}
                                latitude={Number(loc.lat)}
                                longitude={Number(loc.long)}
                                url={loc.playbackUrl}
                                startTime={new Date(loc.startTime)}
                                endTime={(loc.endTime == null || loc.endTime === '') ? undefined : new Date(loc.endTime)}
                                thumbnailUrl={loc.thumbnailUrl === '' ? undefined : loc.thumbnailUrl}
                                channelType={loc.channelType}
                            />
                        ))}
                </MapView>
            </Flex>
            <div style={{
                position: 'fixed',
                bottom: '10px',
                width: '100%',
                height: '10vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 100
            }}>
                <div style={{
                    backgroundColor: 'white',
                    boxShadow: '0 20px 40px rgb(0 0 0 / 10%)',
                    borderRadius: '10px'
                }}>
                    <div style={{
                        padding: '1.5rem',
                        display: 'flex',
                        flex: '1',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TextField paddingRight="0px" size="small" fontSize="1rem" label="방송 이름" labelHidden={true} placeholder="방송 이름" value={title}
                                   onChange={changeTitle} />
                        <Link to={`/broadcast?titleName=${title}`} replace={true} style={{ marginLeft: '15px', width: '40%' }}>
                            <Button variation="primary" width="100%">
                                방송하기
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </View>
    )
}

export default Map
