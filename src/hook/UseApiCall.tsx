import { useEffect, useState } from 'react'


function useApiCall<R, T extends () => Promise<R>> (fn: T, skip: boolean = false): [boolean, any | null, R | null] {
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState<any | null>(null)
    const [data, setData] = useState<R | null>(null)

    useEffect(() => {
        if (skip) {
            return
        }
        setLoading(true)
        fn()
            .then(res => {
                setData(res)
                setError(null)
            })
            .catch(e => {
                setData(null)
                setError(e)
            }).finally(() => {
            setLoading(false)
        })
    }, [fn, skip])

    return [isLoading, error, data]
}

export default useApiCall
