import { HOST } from './Config'
import { get } from './Base'

export interface PlayableChannelInfo {
    playbackUrl: string
    videoUrl: string
    channelName: string
    channelTitle: string
    lat: string
    long: string
    startTime: string
    endTime?: string
    thumbnailUrl: string
}

export async function getChannelsAPI (): Promise<PlayableChannelInfo[]> {
    console.log('call getChannelsAPI')

    try {
        const res = await get(`${HOST}/channels`)
        return res.json()
    } catch (e: any) {
        throw new Error(e)
    }
}
