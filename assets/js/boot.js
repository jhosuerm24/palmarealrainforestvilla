/* Runs before first paint: skips the language gate for returning visitors and refuses to render inside someone else's frame (clickjacking). */
(function(){
  var h=document.documentElement;
  try{if(window.top!==window.self&&/(^|\.)palmarealrainforestvilla\.com$/.test(location.hostname)){h.style.visibility='hidden';try{window.top.location=window.self.location.href}catch(e){}}}catch(e){}
  try{var l=localStorage.getItem('pr_lang');if((l==='en'||l==='es')&&location.hash!=='#welcome'){h.classList.add('nogate');h.lang=l}}catch(e){}
})();
