import { useState, useEffect } from 'react';

export const useFetchAPI = (url) => {
    const [result, setResult] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {        
        const controller = new AbortController();
        const signal = {signal: controller.signal};
        async function getDataFromAPI() {
            setIsLoading(true);
            try {            
                const res = await fetch(url, signal);
                const data = await res.json();                
                setResult(data);                          
    
            } catch (err) {
                console.log(err);
                setError(err.message);
            }
            setIsLoading(false);
            
        }

        getDataFromAPI();

        return function cleanup() {controller.abort();}
    
    }, []);   

    return {result, isLoading, error};
    
}
 