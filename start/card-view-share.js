(function(){
'use strict';if(document.getElementById('card-roomy'))return;
var roomy=document.createElement('style');roomy.id='card-roomy';roomy.textContent=[
'.band{padding:18px 20px 46px!important}',
'.band>img:not(.face){width:140px!important;height:70px!important}',
'main{margin-top:-30px!important;padding:0 18px 14px!important}',
'.cardbox{padding:18px!important}',
'h1{font-size:26px!important}.role{font-size:13px!important;margin-top:3px!important}',
'.actions{gap:9px!important;margin-top:14px!important}',
'.actions a.btn.b-text{padding:12px!important}',
'.actions a.btn.b-call,.actions a.btn.b-email{padding:11px 10px!important}',
'.actions a.btn.b-save{font-size:14px!important;padding:10px!important}',
'.actions a.btn.b-book{padding:12px!important}',
'.proof{margin-top:10px!important}',
'a.prooflink{padding:10px!important;margin-top:9px!important}',
'.ccawrap{margin-top:10px!important}',
'.ccawrap #ccabtn{padding:12px!important;font-size:16px!important}',
'.ccawrap #ccapanel{margin-top:10px!important}',
'footer{font-size:11px!important;padding:8px 0 0!important}',
'body{padding-bottom:16px!important}'
].join('\n');document.head.appendChild(roomy);
var recipient=new URL(location.href).searchParams.get('recipient')==='1';var userMoved=false;['wheel','touchmove','keydown'].forEach(function(e){addEventListener(e,function(){userMoved=true;},{passive:true});});var base=location.pathname, isAidan=/^\/start\/contact\/(?:claim\/)?$/.test(base);
var sections={top:document.querySelector('.cardbox'),claim:null,booking:document.querySelector('.booking'),contact:document.querySelector('.share')};
var status=document.createElement('p');status.style.cssText='font-size:12px;color:var(--muted);text-align:center';status.setAttribute('aria-live','polite');
var share=document.createElement('a');share.id='card-view-share';share.className='btn sharebtn';share.href='#';share.textContent='Share this view';share.style.cssText='display:none;margin:12px 0 0;text-align:center;box-shadow:0 2px 12px #0003';var host=document.querySelector('.cardbox');if(!host)return;
function panel(){return document.getElementById('ccapanel');}
function shown(el){return el&&getComputedStyle(el).display!=='none';}
function syncShare(){var p=panel();if(p&&shown(p)){if(share.parentNode!==p){p.appendChild(share);p.appendChild(status);}share.style.display=recipient?'none':'block';}else{share.style.display='none';}}
var syncScheduled=false;function scheduleSync(){if(syncScheduled)return;syncScheduled=true;requestAnimationFrame(function(){syncScheduled=false;syncShare();});}
new MutationObserver(scheduleSync).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['style','class']});
syncShare();
function setURL(view){var u=new URL(location.href);if(view==='claim'&&isAidan&&shown(panel()))u.pathname='/start/contact/claim/';u.hash=view==='top'?'':view;var sel=document.getElementById('ccacarrier');u.search='';if(recipient)u.searchParams.set('recipient','1');if(view==='claim'&&sel&&sel.value&&sel.value!=='ot')u.searchParams.set('carrier',sel.value);share.href=u.href;return u.href;}
function current(){if(target&&!userMoved&&['claim','booking','contact'].indexOf(target)>=0)return target;sections.claim=shown(panel())?panel():null;var entries=Object.keys(sections).map(function(k){var e=sections[k];return e&&shown(e)?{key:k,rect:e.getBoundingClientRect()}:null;}).filter(Boolean);if(innerHeight+scrollY>=document.documentElement.scrollHeight-8&&sections.contact)return 'contact';var line=Math.min(innerHeight*.35,240);var hit=entries.filter(function(e){return e.rect.top<=line&&e.rect.bottom>line;});return hit.length?hit[hit.length-1].key:'top';}
var timer;addEventListener('scroll',function(){clearTimeout(timer);timer=setTimeout(function(){setURL(current());},160);},{passive:true});
document.addEventListener('change',function(e){if(e.target.id==='ccacarrier')setURL('claim');});
async function doShare(e,view){e.preventDefault();if(e.stopImmediatePropagation)e.stopImmediatePropagation();var selectedView=view||(shown(panel())?'claim':current()),url=setURL(selectedView);if(selectedView==='claim'){var values={};['ccacarrier','ccaname','ccaaddr','ccaclaim','ccaphone','ccaotemail'].forEach(function(id){var el=document.getElementById(id);if(el)values[id]=el.value;});var bytes=new TextEncoder().encode(JSON.stringify(values)),raw='';bytes.forEach(function(b){raw+=String.fromCharCode(b);});var snapshot=new URL(url);snapshot.searchParams.set('recipient','1');snapshot.hash='claim&form='+btoa(raw).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');url=snapshot.href;}try{if(navigator.share)await navigator.share({title:document.title,url:url});else{await navigator.clipboard.writeText(url);status.textContent='Link copied with the current form entries. Share only with the intended homeowner.';}}catch(err){if(err.name!=='AbortError')status.textContent=url;}}
share.addEventListener('click',doShare);document.addEventListener('click',function(e){if(e.target.closest('#shareclaimform'))doShare(e,'claim');},true);
if(recipient){share.style.display='none';var hide=document.createElement('style');hide.textContent='.actions>a,.cardbox>.booking,.cardbox>.share,.cardbox>.proof,.prooflink,footer,#shareclaimform,#claimsharestatus,#ccacopy,#card-view-share{display:none!important}#ccabtn{display:none!important}';document.head.appendChild(hide);document.querySelectorAll('a,button').forEach(function(el){if(el.id!=='ccasend')el.style.setProperty('display','none','important');});}
// Only the allowlisted form inputs are restored. No HTML, secrets or other page state.
var incomingHash=location.hash.slice(1),target=incomingHash.split('&')[0], carrier=new URL(location.href).searchParams.get('carrier');
if(target==='claim'&&!isAidan){var btn=document.getElementById('ccabtn');if(btn&&panel()&&!shown(panel()))btn.click();}
var p=panel(),sel=document.getElementById('ccacarrier');if(carrier&&sel&&Array.prototype.some.call(sel.options,function(o){return o.value===carrier&&carrier!=='ot';})){sel.value=carrier;sel.dispatchEvent(new Event('change'));}
if(target==='claim'&&shown(p)){try{var packed=new URLSearchParams(incomingHash.slice(incomingHash.indexOf('&')+1)).get('form');if(packed&&packed.length<=24000){var raw=atob(packed.replace(/-/g,'+').replace(/_/g,'/')),values=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(raw,function(c){return c.charCodeAt(0);})));['ccacarrier','ccaname','ccaaddr','ccaclaim','ccaphone','ccaotemail'].forEach(function(id){var el=document.getElementById(id),v=values[id];if(!el||typeof v!=='string'||v.length>4000)return;if(id==='ccacarrier'&&!Array.prototype.some.call(el.options,function(o){return o.value===v;}))return;el.value=v;if(id==='ccacarrier')el.dispatchEvent(new Event('change'));});}}catch(err){status.textContent='The shared form details could not be read. Please fill in the form.';}requestAnimationFrame(function(){p.scrollIntoView({block:'start'});});}
else if(sections[target])requestAnimationFrame(function(){sections[target].scrollIntoView({block:'start'});});
if(isAidan&&!/\/claim\/$/.test(base)){new MutationObserver(function(){if(shown(panel()))setURL('claim');}).observe(document.querySelector('.actions'),{childList:true,subtree:true});}
})();
