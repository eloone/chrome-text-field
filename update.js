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
 * Page update
 **/
(function(window){
    var height = localStorage.getItem('height');

    document.addEventListener('DOMContentLoaded', function () {
        if(height){
            if(height >= 300){
                document.getElementById('content').style.height = height + 'px';
            }
        }

        document.getElementById('external_link').addEventListener('click', function(e){
            chrome.tabs.create({url:'https://github.com/eloone/chrome-text-field'});
            return false;
        });

    });


})(this);