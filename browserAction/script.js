// document.getElementById('myHeading').style.color = 'red'

console.log('Popup opened');

document.getElementById('saveTabs').onclick = event => {
    console.log('SaveTabs button clicked');
    let tabsPromise = browser.tabs.query({currentWindow: true});
    tabsPromise.then(tabs => {
        console.log('Currently opened tabs list');

        let tabUrls = tabs.map(tab => tab.url); 

        console.log(tabUrls);
        browser.storage.local.set({tabUrls: tabUrls}).then(
            () => {
                    console.log('Saved to Storage');
                }, 
            error => { console.log('Error saving to storage') }
        );
    }, error => {
        console.log(error);
    });
}


document.getElementById('restoreTabs').onclick = event => {
    console.log('RestoreTabs button clicked');

    browser.storage.local.get('tabUrls').then(
        (value) => {
            tabUrls = value['tabUrls'];
            console.log('Found urls');
            console.log(tabUrls);
            
            // Remove privileged urls
            let unsafePrefix = ['chrome:', 'javascript:', 'data:', 'file:','about:config',
        'about:addons', 'about:debugging', 'about:devtools-toolbox'];

            let safeUrls = [];
            for (let tabUrl of tabUrls) {
                let isSafe = true;
                for (let prefix of unsafePrefix) {
                    if (tabUrl.startsWith(prefix)) {
                        isSafe = false;
                        break;
                    }
                }
                if (isSafe) {
                    safeUrls.push(tabUrl);
                }
            }
        
            // Open a new window with these tab urls
            browser.windows.create({url: safeUrls });
        
        }, 
        error => { console.log('Error getting the tabUrls from storage') }
    );
}