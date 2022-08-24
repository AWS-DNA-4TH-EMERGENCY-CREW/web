export type DeviceInfo = { videoDevices: MediaDeviceInfo[]; audioDevices: MediaDeviceInfo[] }

export async function handlePermissions (): Promise<DeviceInfo> {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    for (const track of stream.getTracks()) {
        track.stop()

    }
    const devices = await navigator.mediaDevices.enumerateDevices()
    return {
        videoDevices: devices.filter((d) => d.kind === 'videoinput'),
        audioDevices: devices.filter((d) => d.kind === 'audioinput')
    }
}

export type StreamInfo = { microphoneStream: MediaStream; cameraStream: MediaStream }

export async function getStream (deiceInfo: DeviceInfo, cameraId: number,  streamConfig : any): Promise<StreamInfo> {
    return {
        cameraStream: await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: deiceInfo.videoDevices[cameraId].deviceId,
                width: {
                    ideal: streamConfig.maxResolution.width,
                    max: streamConfig.maxResolution.width,
                },
                height: {
                    ideal: streamConfig.maxResolution.height,
                    max: streamConfig.maxResolution.height,
                },
            },
        }),
        microphoneStream: await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: deiceInfo.audioDevices[0].deviceId },
        })
    }
}

