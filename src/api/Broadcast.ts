import { HOST } from './Config'
import { post } from './Base'

interface CreateChannelInput {
    lat: string
    long: string
    channelName: string
    channelTitle: string
}

export interface ChannelInfo {
    ingestEndpoint: string
    channelName: string
    streamKey: string
}

export async function createChannelAPI (body: CreateChannelInput): Promise<ChannelInfo> {
    console.log('call createChannelAPI', body)

    try {
        const res = await post(`${HOST}/channel`, JSON.stringify(body))
        return res.json()
    } catch (e: any) {
        throw new Error(e)
    }
}

export async function startBroadcastAPI (channelName: string): Promise<void> {
    console.log('call startBroadcastAPI', channelName)
    try {
        const res = await post(`${HOST}/channels/${channelName}/start`, JSON.stringify({ channelName }))
        return res.json()
    } catch (e: any) {
        throw new Error(e)
    }
}


export async function stopBroadcastAPI (channelName: string): Promise<void> {
    console.log('call stopBroadcastAPI', channelName)
    try {
        const res = await post(`${HOST}/channels/${channelName}/stop`, JSON.stringify({ channelName }))
        return res.json()
    } catch (e: any) {
        throw new Error(e)
    }
}
