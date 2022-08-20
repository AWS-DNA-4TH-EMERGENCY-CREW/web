import { useEffect, useState } from 'react'


function useApiCall<R, T extends () => Promise<R>> (fn: T): [boolean, any | null, R | null] {
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState<any | null>(null)
    const [data, setData] = useState<R | null>(null)

    useEffect(() => {
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
    }, [fn])

    return [isLoading, error, data]
}

export default useApiCall
