
export const post = (url: string, body? : string) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body
    })
}
