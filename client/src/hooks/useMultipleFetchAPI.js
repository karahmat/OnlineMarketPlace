import { useState, useEffect } from 'react';

export const useMultipleFetchAPI = (urls) => {
    const [result, setResult] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        console.log("this useMultipleFetch api is called");
        const controller = new AbortController();
        const signal = {signal: controller.signal};
        async function getDataFromAPI() {
            setIsLoading(true);
            try {
                const response = Promise.all(urls.map((url, i) =>
                      fetch(url, signal).then(resp => resp.json())
                  )).then(json=> {
                      console.log(json);
                      setResult(json);
                  })
            } catch (error) {
                console.error(error);
                setError(error);
            }
            setIsLoading(false);
            
        }

        getDataFromAPI();

        return function cleanup() {controller.abort();}
    
    }, []);   

    return {result, isLoading, error};
    
}
 