
const siteBlocker = (() => {
    const readStorage = () => {
        return new Promise(resolve => {
            chrome.storage.sync.get(undefined, d => {
                resolve(typeof(d.data) === "object" ? d.data : {})
            });
        });
    }
    
    const writeStorage = (data) => {
        return new Promise(resolve => {
            chrome.storage.sync.set({
                data: data
            }, resolve);
        });
    }

    const getBlockedHosts = async () => {
        const data = await readStorage()
        const blockedHosts = data.blockedHosts
        return typeof(blockedHosts) === "object" ? blockedHosts : []
    }
    
    const setBlockedHosts = async (hosts) => {
        const data = await readStorage()
        await writeStorage({
            ...data,
            blockedHosts: hosts,
        })
    }

    const isBlockedUrl = async (url) => {
        const blockedHosts = await getBlockedHosts()
        return blockedHosts.indexOf(url.host) >= 0
    }
    
    const blockUrl = async (url) => {
        const blockedHosts = await getBlockedHosts()
        const host = url.host
        await setBlockedHosts([
            ...blockedHosts,
            host,
        ])
    }
    
    const unblockUrl = async (url) => {
        const blockedHosts = await getBlockedHosts()
        const host = url.host
        await setBlockedHosts(blockedHosts.filter(s => s !== host))
    }

    return {
        isBlockedUrl,
        blockUrl,
        unblockUrl,
    }
})()

let url = new URL(document.URL)
siteBlocker.isBlockedUrl(url).then(isBlocked => {
    if (isBlocked) {
        document.body.innerHTML = `<div style="background-color: #ffffff; color: #000000; padding: 10px;">This site is blocked.</div>`
    }
})