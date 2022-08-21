
export const post = (url: string, body? : string) => {
    console.log(`POST CALL ${url} \n ${JSON.stringify(body, null, 2)}`)
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body
    })
}

export const get = (url: string) => {
    console.log(`GET CALL ${url}`)
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    })
}
