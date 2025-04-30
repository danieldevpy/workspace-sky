import React from "react";
import ico from "../assets/favicon.ico"

export default function FavIcon({url, size}: {url: string, size: number}) {

    const [urlCurrent, setUrlCurrent] = React.useState(url)

    const getFavicon = (url: string) => {
        const urlObj = new URL(url);
        const favicon = `https://www.google.com/s2/favicons?sz=64&domain=${urlObj.hostname}`;
        return favicon
      };
    
    React.useEffect(()=>{
        const new_url = getFavicon(url);
        setUrlCurrent(new_url)
    }, [url])

    return (
        <img src={urlCurrent} alt="favicon" width={16} height={16} />
    )
}