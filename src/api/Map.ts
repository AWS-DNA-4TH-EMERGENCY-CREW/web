import { HOST } from './Config'
import { sleep } from '../utils/Sleep'
import { get } from './Base'

export interface PlayableChannelInfo {
    playbackUrl: string
    channelName: string
    lat: string
    long: string
}

export async function getChannelsAPI (): Promise<PlayableChannelInfo[]> {
    console.log('call getChannelsAPI')
    await sleep(3000)
    return [
        {
            'channelName': 'hi6',
            'playbackUrl': 'https://d3cgmkcvd3sd1x.cloudfront.net/ivs/v1/352298775703/W6rj8pmzBRer/2022/8/20/13/0/WPYBMsjVIlOi/media/hls/master.m3u8',
            'lat': '37.498468',
            'long': '127.028020'
        },
        {
            'channelName': 'gangnam',
            'playbackUrl': 'https://d3cgmkcvd3sd1x.cloudfront.net/ivs/v1/352298775703/cilzeuKrBOfX/2022/8/21/12/15/HCw4w63ex35T/media/hls/master.m3u8',
            'lat': '37.498323',
            'long': '127.027013'
        },
        {
            'channelName': 'gangnamasdf123',
            'playbackUrl': 'https://d3cgmkcvd3sd1x.cloudfront.net/ivs/v1/352298775703/L4NU6H9gqvkY/2022/8/21/12/40/Elb3nDlmprNh/media/hls/master.m3u8',
            'lat': '37.498323',
            'long': '127.025013'
        }
    ]

    try {
        const res = await get(`${HOST}/channels`)
        return res.json()
    } catch (e: any) {
        throw new Error(e)
    }
}
