import { HOST } from './Config'
import { get } from './Base'

export enum ChanelType {
    LIVE = 'LIVE',
    ENCODING = 'ENCODING',
    VIDEO = 'VIDEO',
    CCTV = 'CCTV',
    TWITTER = 'TWITTER'
}

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
    channelType: ChanelType
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
