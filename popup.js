// Copyright (c) 2013 Elodie Rafalimanana. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
* Google analytics
*/

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-39772841-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

/**
 * Extension Text Field
 * This extension provides a simple text field on click.
 * It is useful to quickly take notes without leaving the browser.
 * If chrome sync is enabled it will sync the data across instances of browsers.
 */

(function(window){

    /**
    * Main settings of the extension
    */
    var settings = {
        //min height of the textarea (when it's empty)
        minHeight : 38,
        //maximum height of the textarea
        maxHeight : 300,
        //default placeholder of the textarea
        placeholder : "Any daydreams ?"
    };

    /**
     * Enables syncing data across instances of browsers
     */
    var Storage = chrome.storage.sync;

    /**
    * When the document DOM is ready
    */
    document.addEventListener('DOMContentLoaded', function () {
        var textarea = document.getElementById('textarea'),
        clear = document.getElementById('clear'),
        emptyEvent = new CustomEvent("isEmpty"),
        overflowEvent = new CustomEvent("isOverflow");

        /**
        * Events the window listens to
        */
        window.addEventListener('focus', fillTextarea);
        window.addEventListener('blur', saveTextarea);

        /**
        * As soon as saving text is possible we enable the textarea
        */
        textarea.removeAttribute('readonly');

        /**
        * Events the clear trigger listens to
        */
        clear.addEventListener('click', function(e){
            textarea.value = '';
            textarea.focus();
            //unfortunately modifying the value progammatically is not caught by the oninput event
            //so we manually trigger the empty event
            textarea.dispatchEvent(emptyEvent);
            trackClicks(e);
        });

        /**
            * Events the textarea listens to
            */
        textarea.addEventListener('isEmpty', function(e){
            //when the popup is empty we set it to its minimum height
            setHeight(settings.minHeight);
        });

        textarea.addEventListener('isOverflow', function(e){
            //when the text overflows the popup, we make the popup expand with its content
            setHeight();
        });

        textarea.addEventListener('input', function(e){
            //whenever content is added to the texarea via the user interface
            if(textarea.value.trim() == ''){
                textarea.dispatchEvent(emptyEvent);
            }
            if(textarea.scrollHeight > textarea.offsetHeight){
                textarea.dispatchEvent(overflowEvent);
            }

            //Since window.onblur is not triggered when popup is closed/out-of-focus https://code.google.com/p/chromium/issues/detail?id=225917
            //We save everytime there is an input
            saveTextarea();
        });

        /**
         * GA handler to track clicks
         */
        function trackClicks(e) {
            _gaq.push(['_trackEvent', e.target.id, 'clicked']);
        }

        /**
         * Writes messages in the interface for the user
         */
        function message(msg){
            document.getElementById('message').innerHTML = msg;
        }

        /**
        * Fills the textarea with content from the localstorage at page load
        * When the popup is on focus
        */
        function fillTextarea(){

            Storage.get('text', function(items){
                if(items.text && !chrome.runtime.lastError){
                    var val = items.text.trim();

                    if(val !== ''){
                        //this makes the textarea focus on the first line
                        textarea.value = '\n'+val;
                    }

                    setHeight();
                }

                if(chrome.runtime.lastError){
                    message('Text coudn\'t be rendered by chrome. Try again and reload the extension.');
                    _gaq.push(['_trackEvent', 'Errors', 'fillTextarea get failed']);
                }
            });

        }

        /**
        * Saves content of the texarea in the localstorage when the popup is closed
        * When the popup is out of focus
        */
        function saveTextarea(){
            Storage.set({
                'text': textarea.value
            }, function(items){
                if(chrome.runtime.lastError){
                    message('Text coudn\'t be saved by chrome.');
                    _gaq.push(['_trackEvent', 'Errors', 'saveTextarea set failed']);
                }
            });
        //check amount of data

        }

        /**
        * Adjusts the height of the textarea
        */
        function setHeight(value){
            var val = value || Math.min(textarea.scrollHeight, settings.maxHeight);
            textarea.style.height = val + 'px';

            //we store the height locally so that other pages can adjust to this height
            localStorage.setItem('height', val);
        }

        /**
         * Update for 0.0.0.5 version to enable chrome sync
         * It transfers the data in localStorage to chrome.storage.sync
         **/
        function update_0_0_0_5(){
            var localStorageContent = '';

            if(localStorage.getItem('text')){
                localStorageContent = localStorage.getItem('text').trim();
            }

            Storage.get(null, function(items){
                if(!chrome.runtime.lastError){
                    if(typeof items.last_update == 'undefined' && typeof items.text == 'undefined'){
                        Storage.set({
                            'text': localStorageContent,
                            'last_update' : '0.0.0.5'
                        }, function(){
                            if(!chrome.runtime.lastError){
                                document.getElementById('read_update_link').style.display = 'block';
                                 _gaq.push(['_trackEvent', 'Updates', '0.0.0.5 updated']);
                            }
                            else{
                                message('Extension update failed. Please reload the extension.');
                                _gaq.push(['_trackEvent', 'Errors', '0.0.0.5 update failed in set']);
                            }
                        });
                    }
                }
                else{
                    message('Extension update failed. Please reload the extension.');
                    _gaq.push(['_trackEvent', 'Errors', '0.0.0.5 update failed in get']);
                }
            });

        }

        /**
        * What we do at page load
        */
        function init(){
            update_0_0_0_5();
            textarea.setAttribute('placeholder', settings.placeholder);
            fillTextarea();
            textarea.focus();
        }

        /**
        * Start
        */
        init();

    });

})(this);