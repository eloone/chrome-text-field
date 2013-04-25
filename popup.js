// Copyright (c) 2013 Elodie Rafalimanana. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
        clear.addEventListener('click', function(){
            textarea.value = '';
            textarea.focus();
            //unfortunately modifying the value progammatically is not caught by the oninput event
            //so we manually trigger the empty event 
            textarea.dispatchEvent(emptyEvent);
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
         * Fills the textarea with content from the localstorage at page load
         * When the popup is on focus 
         */
        function fillTextarea(){
            if(localStorage.getItem('text')){
                var val = localStorage.getItem('text').trim();
                if(val !== ''){
                    //this makes the textarea focus on the first line
                    textarea.value = '\n'+val;
                }
            }
        }
        
        /**
         * Saves content of the texarea in the localstorage when the popup is closed
         * When the popup is out of focus
         */
        function saveTextarea(){
            localStorage.setItem('text', textarea.value);
        }
        
        /**
         * Adjusts the height of the textarea
         */
        function setHeight(value){
            var val = value || Math.min(textarea.scrollHeight, settings.maxHeight);
            textarea.style.height = val + 'px';
        }
        
        /**
         * What we do at page load
         */
        function init(){
            textarea.setAttribute('placeholder', settings.placeholder);
            fillTextarea();
            textarea.focus();
            setHeight();
        }
        
        /**
         * Start
         */
        init();

    });
    
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
    
})(this);