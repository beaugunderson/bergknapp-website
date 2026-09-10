async page => {
  const report = [];
  for (const theme of ['light', 'dark']) {
    await page.emulateMedia({colorScheme:theme});
    await page.setViewportSize({width:1280,height:1000});
    await page.goto('http://127.0.0.1:8770');
    const result = await page.evaluate(() => {
      const rgb = s => s.match(/[\d.]+/g).map(Number);
      const luminance = c => c.slice(0,3).map(v => v/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
      const ratio = (a,b) => { const x=luminance(a),y=luminance(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };
      const blend = (front,back) => front.slice(0,3).map((v,i)=>v*(front[3]??1)+back[i]*(1-(front[3]??1)));
      const background = el => {const ancestors=[];for(let p=el;p;p=p.parentElement)ancestors.unshift(p);return ancestors.reduce((bg,p)=>blend(rgb(getComputedStyle(p).backgroundColor),bg),[255,255,255]);};
      const rows=[];
      const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
      while(walk.nextNode()) {
        const node=walk.currentNode,el=node.parentElement,text=node.textContent.trim();
        if(!text || ['STYLE','SCRIPT'].includes(el.tagName) || !el.getClientRects().length || el.closest('svg')) continue;
        const box=el.getBoundingClientRect();
        if(box.bottom<0 || getComputedStyle(el).visibility==='hidden') continue;
        const style=getComputedStyle(el),bg=background(el),fg=blend(rgb(style.color),bg),value=ratio(fg,bg);
        const large=parseFloat(style.fontSize)>=24 || (parseFloat(style.fontSize)>=18.6667 && parseInt(style.fontWeight)>=700);
        rows.push({text:text.slice(0,80),selector:el.id?'#'+el.id:el.tagName.toLowerCase()+(el.className?'.'+String(el.className).split(' ').join('.'):''),color:style.color,background:bg,ratio:Number(value.toFixed(2)),required:large?3:4.5,pass:value>=(large?3:4.5)});
      }
      const vars=getComputedStyle(document.documentElement),accent=rgb(vars.getPropertyValue('--accent').trim().startsWith('#') ? (()=>{const h=vars.getPropertyValue('--accent').trim();return 'rgb('+[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)).join(',')+')';})() : vars.getPropertyValue('--accent'));
      const focus=['body','.app','.knap .app-visual','.spacebar .app-visual','.tuck .app-visual'].map(selector=>({selector,ratio:Number(ratio(accent,background(document.querySelector(selector))).toFixed(2))}));
      return {minimum:Math.min(...rows.map(r=>r.ratio)),failures:rows.filter(r=>!r.pass),rows,focus};
    });
    const interactions=[];
    for(const selector of ['.app.knap','.app.spacebar','.app.tuck','footer a']) {
      await page.locator(selector).hover();
      interactions.push(await page.locator(selector).evaluate(el=>({selector:el.className || 'footer a',color:getComputedStyle(el).color,background:getComputedStyle(el).backgroundColor})));
    }
    report.push({theme,...result,hover:interactions});
  }
  return report;
}
