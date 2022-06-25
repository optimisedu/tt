document.querySelectorAll("form").forEach(t=>{t.addEventListener("submit",e=>{if(t.classList.contains("is-submitting")){e.preventDefault()}t.classList.add("is-submitting")})});(function(){"use strict";function e(n){n.addEventListener("keydown",function(e){var t=e.charCode||e.keyCode;if(t===32){e.preventDefault();n.click()}})}var t=document.querySelectorAll('a[role="button"]');for(var n=0;n<t.length;n++){e(t[n])}})();const exposed={};if(location.search){var a=document.createElement("a");a.href=location.href;a.search="";history.replaceState(null,null,a.href)}function tweet_(e){open("https://twitter.com/intent/tweet?url="+encodeURIComponent(e),"_blank")}function tweet(e){tweet_(e.getAttribute("href"))}expose("tweet",tweet);function share(e){var t=e.getAttribute("href");event.preventDefault();if(navigator.share){navigator.share({url:t})}else if(navigator.clipboard){navigator.clipboard.writeText(t);message("Article URL copied to clipboard.")}else{tweet_(t)}}expose("share",share);function message(e){var t=document.getElementById("message");t.textContent=e;t.setAttribute("open","");setTimeout(function(){t.removeAttribute("open")},3e3)}function prefetch(e){if(e.target.tagName!="A"){return}if(e.target.origin!=location.origin){return}const t=e=>e.split("#")[0];if(t(window.location.href)===t(e.target.href)){return}var n=document.createElement("link");n.rel="prefetch";n.href=e.target.href;document.head.appendChild(n)}document.documentElement.addEventListener("mouseover",prefetch,{capture:true,passive:true});document.documentElement.addEventListener("touchstart",prefetch,{capture:true,passive:true});const GA_ID=document.documentElement.getAttribute("ga-id");window.ga=window.ga||function(){if(!GA_ID){return}(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;ga("create",GA_ID,"auto");ga("set","transport","beacon");var timeout=setTimeout(onload=function(){clearTimeout(timeout);ga("send","pageview")},1e3);var ref=+new Date;function ping(e){var t=+new Date;if(t-ref<1e3){return}ga("send",{hitType:"event",eventCategory:"page",eventAction:e.type,eventLabel:Math.round((t-ref)/1e3)});ref=t}addEventListener("pagehide",ping);addEventListener("visibilitychange",ping);const dynamicScriptInject=n=>{return new Promise(e=>{const t=document.createElement("script");t.src=n;t.type="text/javascript";document.head.appendChild(t);t.addEventListener("load",()=>{e(t)})})};const sendWebVitals=document.currentScript.getAttribute("data-cwv-src");if(/web-vitals.js/.test(sendWebVitals)){dynamicScriptInject(`${window.location.origin}/js/web-vitals.js`).then(()=>{webVitals.getCLS(sendToGoogleAnalytics);webVitals.getFID(sendToGoogleAnalytics);webVitals.getLCP(sendToGoogleAnalytics)}).catch(e=>{console.error(e)})}addEventListener("click",function(e){var t=e.target.closest("button");if(!t){return}ga("send",{hitType:"event",eventCategory:"button",eventAction:t.getAttribute("aria-label")||t.textContent})},true);var selectionTimeout;addEventListener("selectionchange",function(){clearTimeout(selectionTimeout);var e=String(document.getSelection()).trim();if(e.split(/[\s\n\r]+/).length<3){return}selectionTimeout=setTimeout(function(){ga("send",{hitType:"event",eventCategory:"selection",eventAction:e})},2e3)},true);if(window.ResizeObserver&&document.querySelector("header nav #nav")){var progress=document.getElementById("reading-progress");var timeOfLastScroll=0;var requestedAniFrame=false;function scroll(){if(!requestedAniFrame){requestAnimationFrame(updateProgress);requestedAniFrame=true}timeOfLastScroll=Date.now()}addEventListener("scroll",scroll);var winHeight=1e3;var bottom=1e4;function updateProgress(){requestedAniFrame=false;var e=Math.min(document.scrollingElement.scrollTop/(bottom-winHeight)*100,100);progress.style.transform=`translate(-${100-e}vw, 0)`;if(Date.now()-timeOfLastScroll<3e3){requestAnimationFrame(updateProgress);requestedAniFrame=true}}new ResizeObserver(()=>{bottom=document.scrollingElement.scrollTop+document.querySelector("#comments,footer").getBoundingClientRect().top;winHeight=window.innerHeight;scroll()}).observe(document.body)}function expose(e,t){exposed[e]=t}addEventListener("click",e=>{const t=e.target.closest("[on-click]");if(!t){return}e.preventDefault();const n=t.getAttribute("on-click");const r=exposed[n];if(!r){throw new Error("Unknown handler"+n)}r(t)});function removeBlurredImage(e){e.style.backgroundImage="none"}document.body.addEventListener("load",e=>{if(e.target.tagName!="IMG"){return}removeBlurredImage(e.target)},"true");for(let e of document.querySelectorAll("img")){if(e.complete){removeBlurredImage(e)}}