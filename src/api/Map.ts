import { HOST, SEOUL_HOST } from './Config'
import { get } from './Base'

export enum ChannelType {
    LIVE = 'LIVE',
    ENCODING = 'ENCODING',
    VIDEO = 'VIDEO',
    CCTV = 'CCTV',
    TWITTER = 'TWITTER'
}

export interface PlayableChannelInfo {
    playbackUrl: string
    channelName: string
    channelTitle: string
    lat: string
    long: string
    startTime: string
    endTime?: string
    thumbnailUrl: string
    channelType: ChannelType
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

export function getCCTVProxyUrl (channelName: string, fileName: string) {
    return `${SEOUL_HOST}/channels/${channelName}/${fileName}`
}

// export async function getCCTVProxyAPI (channelName: string, fileName: string): Promise<PlayableChannelInfo[]> {
//     console.log('call getCCTVProxyAPI')
//
//     try {
//         const res = await get(`${HOST}/channels/${channelName}/${fileName}`)
//         return res.json()
//     } catch (e: any) {
//         throw new Error(e)
//     }
// }
