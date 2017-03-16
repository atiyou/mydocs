//tealium universal tag - utag.24 ut4.0.201605090844, Copyright 2016 Tealium.com Inc. All Rights Reserved.
window.xtnv=document;window.xtsd="";window.xtdmc=".leboncoin.fr";var dom=window.document.domain;if(utag_data.environnement==="dev"&&/[a-z]*.[a-z]*.dev.leboncoin.lan/.test(dom)){window.xtsite=562495;}
if(utag_data.environnement==="dev"&&/[a-z]*.qa[0-9]{1}.bon-coin.net/.test(dom)){window.xtsite=562496;}
if(utag_data.environnement==="qa"){window.xtsite=562496;}
if(utag_data.environnement==="prod"){window.xtsite=562498;}
window.xtn2="";window.xtpage="";window.xtdi="";window.xt_multc="";window.xt_an="";window.xt_ac="";window.xttp="";window.xt_ordermc="";window.xt_orderid="";try{if(!utag.libloader){utag.libloader=function(src,handler,a,b){"use strict";a=document;b=a.createElement('script');b.language='javascript';b.type='text/javascript';b.src=src;if(typeof handler==='function'){b.handlerFlag=0;b.onreadystatechange=function(){if((this.readyState==='complete'||this.readyState==='loaded')&&!b.handlerFlag){b.handlerFlag=1;handler();}};b.onload=function(){if(!b.handlerFlag){b.handlerFlag=1;handler();}};a.getElementsByTagName('head')[0].appendChild(b);}};}
(function(id,loader,u){"use strict";try{u=utag.o[loader].sender[id]={};}catch(e){u=utag.sender[id];}
u.ev={'view':1};u.qsp_delim="&";u.kvp_delim="=";u.map={"js_page.xtsite":"xtsite","js_page.xtn2":"xtn2","eventname":"xtpage","js_page.xtsd":"xtsd","js_page.plateformdevice":"x1","displaytype":"x2","pagetype":"x3","previouspage":"x4","js_page.actiondescription":"x6","listid":"x7","adid":"x8","cat_id":"x9","subcat_id":"x10","region":"x11","departement":"x12","options":"x14","store_id_annonceur":"x15","offres":"x16","store_id":"xt_an","ad_type":"x13","compte":"xt_ac","publish_date":"x17","last_update_date":"x18","city":"x20","boutique_id":"x21","xiti_implication_degree":"xtdi","js_page.panier":"xtidcart"};u.extend=[];u.send=function(a,b){if(u.ev[a]||u.ev.all!==undefined){var par=[],d,e,f,c=0;window.xt_multc="";window.xt_ordermc="";for(d in utag.loader.GV(u.map)){if(b[d]!==undefined&&b[d]!==""){e=u.map[d].split(",");for(f=0;f<e.length;f++){if(e[f].match(/x[0-9]+/)){window.xt_multc+='&'+e[f]+'='+b[d];}else if(e[f].match(/o[0-6]/)){window.xt_ordermc+='&'+e[f]+'='+b[d];}else{window[e[f]]=b[d];}}}}
if(window.xt_an===''){window.xt_an=b._ccustid;}
utag.DB(par);par.push('ac='+window.xt_ac+'&an='+window.xt_an+window.xt_multc);if(b._corder||window.xt_orderid){if(b._ctax===''){b._ctax='0';}
if(b._cship===''){b._cship='0';}
if(window.xt_orderid===undefined||window.xt_orderid===""){window.xt_orderid=b._corder;}
par.push("cmd="+window.xt_orderid);if(window.xt_newcus===undefined){window.xt_newcus="1";}
par.push("newcus="+window.xt_newcus);if(window.xt_roimt===undefined){window.xt_roimt=b._ctotal;}
par.push("roimt="+window.xt_roimt);if(window.xt_totalTF===undefined){window.xt_totalTF=b._csubtotal;}
par.push("mtht="+window.xt_totalTF);if(window.xt_totalATI===undefined){window.xt_totalATI=b._ctotal;}
par.push("mtttc="+window.xt_totalATI);if(window.xt_shipATI===undefined){window.xt_shipATI=(parseInt(b._cship,10)+parseInt(b._ctax,10)).toString();}
par.push("fp="+window.xt_shipATI);if(window.xt_shipTF===undefined){window.xt_shipTF=b._cship;}
par.push("fpht="+window.xt_shipTF);if(window.xt_tax===undefined){window.xt_tax=b._ctax;}
par.push("tax="+window.xt_tax);if(window.xt_paym===undefined){window.xt_paym="1";}
par.push("mp="+window.xt_paym);if(window.xt_status===undefined){window.xt_status="1";}
par.push("st="+window.xt_status);if(window.xt_delivery===undefined){window.xt_delivery="1";}
par.push("dl="+window.xt_delivery);if(window.xt_promocode===undefined){window.xt_promocode=b._cpromo;}
par.push("pcd="+window.xt_promocode);if(window.xt_discountATI===undefined){window.xt_discountATI=parseInt(b._ctax,10).toString();}
par.push("dsc="+window.xt_discountATI);if(window.xt_discountTF===undefined){window.xt_discountTF="0";}
par.push("dscht="+window.xt_discountTF);if(window.xtidcart===undefined){window.xtidcart=b['cp.utag_main_ses_id'];}
par.push("idcart="+window.xtidcart+window.xt_ordermc);}
if(window.xttp==='cart'||(typeof b._cprod!="undefined"&&b._cprod.length>0)){window.xt_cart=function(){var _cprod=b._cprod?b._cprod.slice(0):[];var _ccat=b._ccat?b._ccat.slice(0):[];var _cquan=b._cquan?b._cquan.slice(0):[];var _cprice=b._cprice?b._cprice.slice(0):[];var _cpdisc=b._cpdisc?b._cpdisc.slice(0):[];for(var d=0;d<_cprod.length;d++){xt_addProduct_v2(_ccat[d],_cprod[d],_cquan[d],_cprice[d],_cprice[d],_cpdisc[d],_cpdisc[d])}};}
if(window.xtparam!==undefined&&window.xtparam!==null){window.xtparam+='&'+par.join(u.qsp_delim);}else{window.xtparam='&'+par.join(u.qsp_delim);}
utag.libloader("//tags.tiqcdn.com/utag/schibsted/custom-templates/prod/utag.1.js",function(){});}};try{utag.o[loader].loader.LOAD(id);}catch(e){utag.loader.LOAD(id);}}('24','schibsted.leboncoin-responsive'));}catch(e){utag.DB(e);}
