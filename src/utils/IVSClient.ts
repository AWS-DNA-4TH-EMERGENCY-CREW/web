// @ts-ignore
import IVSBroadcastClient from 'amazon-ivs-web-broadcast'
const streamConfig = IVSBroadcastClient.BASIC_LANDSCAPE

export function createClient (ingestEndpoint: string) {
    return IVSBroadcastClient.create({
        // Enter the desired stream configuration
        streamConfig,
        // Enter the ingest endpoint from the AWS console or CreateChannel API
        ingestEndpoint,
        logLevel: IVSBroadcastClient.LOG_LEVEL.DEBUG
    })
}
