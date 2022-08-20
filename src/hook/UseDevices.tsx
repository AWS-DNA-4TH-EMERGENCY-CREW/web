import { useCallback, useState } from 'react'
import { getStream, handlePermissions, StreamInfo } from '../utils/Device'


function useDevices (): [boolean, any | null, (streamConfig: any) => Promise<StreamInfo | null>] {
    const [isCalled, call] = useState(false)
    const [error, setError] = useState<any | null>(null)
    const [isLoading, setLoading] = useState(false)
    const [storedStreamInfo, setStoredStream] = useState<StreamInfo | null>(null)

    const getDeviceStream = useCallback(async (streamConfig: any) => {
        if (isCalled) {
            return storedStreamInfo as StreamInfo
        }
        setLoading(true)
        try {
            const deviceInfo = await handlePermissions()
            const streamInfo = await getStream(deviceInfo, streamConfig)
            setStoredStream(streamInfo)
            call(true)
            setLoading(false)
            return streamInfo
        } catch (e) {
            setError(error)
            return null
        }
    }, [error, isCalled, storedStreamInfo])

    return [isLoading, error, getDeviceStream]
}


export default useDevices