
const tabsManager = (() => {
    const getActiveTab = () => {
        return new Promise(resolve => {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                resolve(tabs[0])
            })
        })
    }

    const getActiveTabUrl = async () => {
        const tab = await getActiveTab()
        return new URL(tab.url)
    }
    
    const reloadActiveTab = async reloadActiveTab => {
        const tab = await getActiveTab()
        chrome.tabs.reload(tab.id)
    }

    return {
        getActiveTabUrl,
        reloadActiveTab,
    }
})()


window.addEventListener('DOMContentLoaded', async () => {
	const actionButton = document.getElementById('action-button')
	const tabUrl = await tabsManager.getActiveTabUrl()

    const updateBlockButton = async () => {
        const isBlocked = await siteBlocker.isBlockedUrl(tabUrl)
        actionButton.value = isBlocked ? "Unblock" : "Block"
    }

    await updateBlockButton()

    actionButton.addEventListener('click', async () => {
        const isBlocked = await siteBlocker.isBlockedUrl(tabUrl)
        if (isBlocked) {
            await siteBlocker.unblockUrl(tabUrl)
        } else {
            await siteBlocker.blockUrl(tabUrl)
        }
        await updateBlockButton()
        await tabsManager.reloadActiveTab()
    })
});