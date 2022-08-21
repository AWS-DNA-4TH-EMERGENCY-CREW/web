import React, { useEffect, useRef, useState } from 'react'
import { Flex, Heading, MapView, Text, View } from '@aws-amplify/ui-react'
import { Marker, Popup } from 'react-map-gl'
import { MapboxEvent } from 'react-map-gl/src/types'
import { getChannelsAPI, PlayableChannelInfo } from '../../api/Map'
import ColumnFlex from '../../components/ColumnFlex'
import randomColor from 'randomcolor'

type MarkerWithPopupProps = {
    key: string
    latitude: number
    longitude: number
    url: string
}

function MarkerWithPopup ({ latitude, longitude, url }: MarkerWithPopupProps) {
    // @ts-ignore
    const { IVSPlayer } = window
    const [ivsPlayer, setIvsPlayer] = useState<any | null>(null)

    const [showPopup, setShowPopup] = useState(false)

    const video = useRef<HTMLVideoElement>(null)

    const handleMarkerClick = ({ originalEvent }: MapboxEvent<MouseEvent>) => {
        originalEvent.stopPropagation()
        setShowPopup(true)
    }

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
        if (ivsPlayer == null || !showPopup) {
            return
        }
        if (showPopup) {
            ivsPlayer.attachHTMLVideoElement(video.current)
            ivsPlayer.load(url)
            ivsPlayer.play()
        } else {
            ivsPlayer.pause()

        }
        console.log(ivsPlayer)
        console.log('player started')
    }, [ivsPlayer, showPopup, url])

    return (
        <>
            <Marker
                latitude={latitude}
                longitude={longitude}
                onClick={handleMarkerClick}
                scale={0.8}
                color={randomColor()}
            />
            {showPopup && (
                <Popup
                    style={{ width: '80%', maxWidth: '80%' }}
                    latitude={latitude}
                    longitude={longitude}
                    offset={{ bottom: [0, -40] }}
                    onClose={() => setShowPopup(false)}
                >
                    <ColumnFlex>
                        <Text>Test</Text>
                        <video ref={video} style={{ width: '100%', height: '100%' }} playsInline></video>
                    </ColumnFlex>
                </Popup>
            )}
        </>
    )
}


function Map () {
    const [locationData, setLocationData] = useState<PlayableChannelInfo[]>([])

    useEffect(() => {
        getChannelsAPI()
            .then(data => setLocationData(data))
    }, [])

    return (
        <View>
            <Flex direction={'column'} alignItems={'center'}>
                <MapView
                    initialViewState={{
                        longitude: 127.06382476375357,
                        latitude: 37.495378727608546,
                        zoom: 12,
                    }}
                    style={{ width: '100%', height: "calc(100vh - 62px)"}}
                >
                    {locationData.map((loc) => (
                        <MarkerWithPopup
                            key={loc.playbackUrl + loc.lat}
                            latitude={Number(loc.lat)}
                            longitude={Number(loc.long)}
                            url={loc.playbackUrl}
                        />
                    ))}
                </MapView>
            </Flex>
        </View>
    )
}

export default Map
