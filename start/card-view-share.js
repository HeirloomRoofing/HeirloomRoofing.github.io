(function(){
'use strict';
var base=location.pathname, isAidan=/^\/start\/contact\/(?:claim\/)?$/.test(base);
var sections={top:document.querySelector('.cardbox'),claim:null,booking:document.querySelector('.booking'),contact:document.querySelector('.share')};
var status=document.createElement('p');status.style.cssText='font-size:12px;color:var(--muted);text-align:center';status.setAttribute('aria-live','polite');
var share=document.createElement('a');share.className='btn sharebtn';share.href='#';share.textContent='Share this view';share.style.cssText='display:block;margin:14px 0';var host=document.querySelector('.cardbox');if(!host)return;host.appendChild(share);host.appendChild(status);
function panel(){return document.getElementById('ccapanel');}
function shown(el){return el&&getComputedStyle(el).display!=='none';}
function setURL(view){var u=new URL(location.href);if(view==='claim'&&isAidan&&shown(panel()))u.pathname='/start/contact/claim/';u.hash=view==='top'?'':view;var sel=document.getElementById('ccacarrier');u.search='';if(view==='claim'&&sel&&sel.value&&sel.value!=='ot')u.searchParams.set('carrier',sel.value);history.replaceState(null,'',u.pathname+u.search+u.hash);share.href=u.href;return u.href;}
function current(){sections.claim=shown(panel())?panel():null;var entries=Object.keys(sections).map(function(k){var e=sections[k];return e&&shown(e)?{key:k,rect:e.getBoundingClientRect()}:null;}).filter(Boolean);var line=Math.min(innerHeight*.35,240);var hit=entries.filter(function(e){return e.rect.top<=line&&e.rect.bottom>line;});return hit.length?hit[hit.length-1].key:'top';}
var timer;addEventListener('scroll',function(){clearTimeout(timer);timer=setTimeout(function(){setURL(current());},160);},{passive:true});
document.addEventListener('change',function(e){if(e.target.id==='ccacarrier')setURL('claim');});
share.addEventListener('click',async function(e){e.preventDefault();var url=setURL(current());try{if(navigator.share)await navigator.share({title:document.title,url:url});else{await navigator.clipboard.writeText(url);status.textContent='Link copied. Personal form entries are not included.';}}catch(err){if(err.name!=='AbortError')status.textContent=url;}});
// A direct public view restores only the section and a listed carrier, never form data.
var target=location.hash.slice(1), carrier=new URL(location.href).searchParams.get('carrier');
if(target==='claim'&&!isAidan){var btn=document.getElementById('ccabtn');if(btn&&panel()&&!shown(panel()))btn.click();}
var p=panel(),sel=document.getElementById('ccacarrier');if(carrier&&sel&&Array.prototype.some.call(sel.options,function(o){return o.value===carrier&&carrier!=='ot';})){sel.value=carrier;sel.dispatchEvent(new Event('change'));}
if(target==='claim'&&shown(p)){requestAnimationFrame(function(){p.scrollIntoView({block:'start'});});}
else if(sections[target])requestAnimationFrame(function(){sections[target].scrollIntoView({block:'start'});});
if(isAidan&&!/\/claim\/$/.test(base)){new MutationObserver(function(){if(shown(panel()))setURL('claim');}).observe(document.querySelector('.actions'),{childList:true,subtree:true});}
})();
