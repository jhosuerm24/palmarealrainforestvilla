/* ---------- i18n: English is read from the page, Spanish lives here ---------- */
window.I18N=(function(){
  const ES={
    nav1:'La tierra',nav2:'Aérea',nav3:'Master plan',nav4:'Vivir aquí',nav5:'Panamá',nav6:'La familia',navCta:'Agenda una visita',
    heroEyebrow:'Potrerillos Abajo · Chiriquí, Panamá',
    heroLead:'Treinta lotes a lo largo de un parque arbolado, bajo el Volcán Barú.',
    avH:'Volcán Barú',avS:'3,474 m · el pico más alto de Panamá',asH:'Y al sur, el mar.',asS:'El Pacífico, en el horizonte',fab:'Escríbenos',
    heroCta:'Agenda una visita privada',heroMore:'Ver el master plan',heroFilmed:'Filmado en la propiedad, noviembre de 2026.',
    landKicker:'La tierra',
    orbitTag:'Tomas reales de dron · desliza para orbitar',orbitMeta:'Órbita aérea',
    c1h:'Volcán Barú. 3,474 m.',c1p:'El pico más alto de Panamá, frente al terreno cada mañana.',
    c2h:'Bosque por todos lados.',c2p:'El campo abierto está rodeado de árboles viejos. Ningún vecino mirando hacia adentro.',
    c3h:'Y al sur, el mar.',c3p:'En días claros, el Pacífico dibuja el horizonte.',
    c4h:'3.2 hectáreas, limpias y listas.',c4p:'En el campo abierto irán las 30 casas. El bosque y la quebrada se quedan como están.',
    planH:'Tres parques en <span class="it">el centro.</span>',
    planP:'La calle principal se abre alrededor de tres jardines alargados con árboles. Hay una sola fila de casas a cada lado: todas miran a los parques y su terraza trasera da a la quebrada o al bosque.',
    lg1:'Lado quebrada',lg2:'Lado bosque',lg3:'Lote fundador',lg4:'Parques centrales',lg5:'Quebrada',lg6:'Sendero privado al río Majagua',
    st1:'por lote',st2:'parques centrales arbolados',st3:'de parques y área verde',
    planNote:'Master plan del arquitecto del proyecto, noviembre de 2026. Las áreas de los lotes salen del cuadro del arquitecto; los linderos en esta vista 3D son aproximados y están sujetos a levantamiento topográfico, permisos y aprobación del PH. Arrastra para mirar alrededor.',
    livK:'Aquí, hoy',livH:'Naturaleza a la que puedes caminar <span class="it">esta mañana.</span>',
    livP:'Cada foto de esta página es un cuadro de nuestras propias tomas del terreno y sus alrededores.',
    t1h:'Tu propio camino al río.',t1p:'Pozas claras y piedras lisas. Un sendero privado hasta el agua es parte del plan.',
    t2g:'Mirando al norte',t2h:'El Barú desde tu porche.',t3g:'Mirando al sur',t3h:'El Pacífico en el horizonte.',
    t4g:'Sendero',t4h:'Un sendero de bosque hasta la cascada.',t4p:'Para ver aves, tucanes y mañanas tranquilas.',
    t5g:'Bambusal',t5h:'Donde estará el bohío de yoga.',t5p:'Un pabellón de madera entre el bambú.',
    hvCap:'Del huerto familiar, noviembre de 2026',hvK:'La cosecha semanal',hvH:'Cada semana, una pequeña <span class="it">cosecha.</span>',
    hvP:'Nuestra familia ha cultivado esta tierra por generaciones. La propia Administración Agrícola de la comunidad llevará a cada casa una cajita con lo que esté en temporada.',
    hvF:'<span>Naranjas</span><span>Limones</span><span>Guayaba</span><span>Plátano</span><span>Guineo</span><span>Caña</span><span>Zapallo</span><span>Maíz</span>',
    hvFine:'Planeado. Un gesto semanal de la tierra donde vives, incluido en la cuota de la comunidad. Las cantidades varían según la temporada y complementan tu supermercado.',
    amK:'El plan',amH:'Lo que vamos a <span class="it">construir.</span>',pl:'Planeado',
    a0h:'Tres parques centrales',a0p:'Jardines alargados con árboles y senderos para caminar, en el centro de la comunidad.',
    a1h:'Entrada con garita',a1p:'Garita, portón y jardín de entrada desde la calle asfaltada.',
    a2h:'Bohío de yoga en el bambú',a2p:'Un pabellón abierto de madera dentro del bambusal.',
    a3h:'Gimnasio de vidrio con vista al volcán',a3p:'Puertas de vidrio plegables que abren el salón hacia el Barú.',
    a4h:'Sauna',a4p:'Calor después del sendero, río frío después del calor.',
    a5h:'Invernadero hidropónico',a5p:'Torres verticales donde cada familia cosecha sus propias hojas verdes.',
    a6h:'Paneles solares en cada casa',a6p:'Paneles en cada techo, diseñados desde el inicio.',
    a7h:'Agua privada',a7p:'Un pozo comunitario y agua de manantial privada.',
    a8h:'Senderos al río y a la cascada',a8p:'Un sendero privado al río Majagua y senderos de bosque al Charco La Pasión y a la cascada.',
    paK:'Por qué Panamá. Por qué aquí.',paH:'Cerca de Boquete. <span class="it">Lejos de todo.</span>',
    s1:'Panamá, segundo mejor país del mundo para retirarse.',s1s:'International Living, Índice Global de Retiro 2026.',
    s2:'Boquete, el mejor lugar para retirarse en el extranjero.',
    s3:'Panamá usa el dólar estadounidense. Sin cambio de moneda.',s3s:'El dólar es moneda de curso legal junto al balboa.',
    s4:'De pensión al mes califican para la visa de Pensionado.',s4s:'Con descuentos para jubilados en Panamá. Confirma los requisitos vigentes con tu abogado.',
    d2:'David y Federal Mall',d3:'Aeropuerto Enrique Malek (DAV)',dFine:'Tiempos aproximados en carro desde el portón.',
    faK:'¿Quién vende?',faH:'La familia <span class="it">Rivera.</span>',
    faL:'<li>Tierra de nuestra familia, cultivada por generaciones.</li><li>Sin intermediarios. Tratas directamente con nosotros.</li><li>Camina el terreno con nosotros antes de decidir.</li><li>Trae a tu propio abogado.</li><li>Financiamiento familiar disponible.</li>',
    faC:'Delys Rivera, en el terreno',
    rsK:'Lotes fundadores',rsH:'Solo 4 lotes <span class="it">fundadores.</span>',
    rsP:'Los primeros lotes, los más cercanos a la calle asfaltada, salen primero a precio de fundador. Únete a la lista de reserva y agendamos tu visita privada al terreno o una videollamada en vivo con nuestra familia.',
    rsNote:'Los números corresponden al master plan conceptual.',rsWa:'¿Prefieres escribirnos ya? WhatsApp',
    fN:'Nombre completo',fC:'País',fE:'Correo',fL:'Busco',o1:'Un lugar para retirarme',o2:'Una segunda casa en la naturaleza',o3:'Una casa para mi familia',o4:'Una inversión',
    fW:'Quiero',w1:'Caminar el terreno en persona',w2:'Una videollamada en vivo del terreno',fBtn:'Unirme a la lista de reserva',
    dnH:'Un último paso.',dnP:'Envía este mensaje por WhatsApp y nuestra familia te responderá para agendar tu visita. Todavía no se ha enviado nada.',
    dnWa:'Enviar por WhatsApp',dnCopy:'Copiar mensaje',
    ft1:'Palma Real Rainforest Villa · Palma Real, Potrerillos Abajo, Chiriquí, República de Panamá.',
    ft2:'Las fotografías y tomas aéreas son cuadros reales de la propiedad y sus alrededores, filmados en noviembre de 2026. El master plan y el modelo 3D son conceptuales: los linderos, tamaños de lote y amenidades son aproximados y están sujetos a levantamiento topográfico, permisos y aprobación del régimen de propiedad horizontal (PH). Las amenidades planeadas aún no están construidas. Esta página no es una oferta de venta; los términos se establecen en un contrato escrito revisado por tu propio abogado.'
  };
  const S={
    en:{statement:'Volcán Barú rises to the north. On clear mornings the Pacific shines to the south. A creek runs along one side, a private forest along the other. In between, 3.2 hectares of open land.',
        hl:['Barú','Pacific','creek','forest','3.2','hectares'],
        start:'Scroll to build the community',entry:'Entrance and guardhouse',lot:(n)=>`Homesite ${n}`,lotShort:'Homesite',tags:{trail:'Private trail to Río Majagua',creek:'Quebrada',entry:'Entrance · guardhouse'},
        founder:'Founder homesite',founderShort:'Founder',creek:'Creek side',forest:'Forest side',faces:'Faces the parks',
        err:'Please add your name and a valid email so we can reach you.',copied:'Copied',copyFail:'Select the text above to copy',
        msg:(f)=>`Hi, I'm ${f.name}${f.country?' from '+f.country:''}. I'd like to join the Palma Real reserve list.\nLooking for: ${f.look}\nI'd like to: ${f.when}\nEmail: ${f.email}`,
        toggle:'ES',toggleAria:'Cambiar a español'},
    es:{statement:'Al norte se levanta el Volcán Barú. En las mañanas claras, al sur brilla el Pacífico. A un lado corre una quebrada; al otro, un bosque privado. En medio, 3.2 hectáreas de terreno abierto.',
        hl:['Barú','Pacífico','quebrada','bosque','3.2','hectáreas'],
        start:'Desliza para construir la comunidad',entry:'Entrada y garita',lot:(n)=>`Lote ${n}`,lotShort:'Lote',tags:{trail:'Sendero privado al río Majagua',creek:'Quebrada',entry:'Entrada · garita'},
        founder:'Lote fundador',founderShort:'Fundador',creek:'Lado quebrada',forest:'Lado bosque',faces:'Frente a los parques',
        err:'Escribe tu nombre y un correo válido para poder contactarte.',copied:'Copiado',copyFail:'Selecciona el texto de arriba para copiarlo',
        msg:(f)=>`Hola, soy ${f.name}${f.country?' de '+f.country:''}. Quiero unirme a la lista de reserva de Palma Real.\nBusco: ${f.look}\nQuiero: ${f.when}\nCorreo: ${f.email}`,
        toggle:'EN',toggleAria:'Switch to English'}
  };
  const els=[...document.querySelectorAll('[data-t]')];
  const EN={};els.forEach(e=>{if(!(e.dataset.t in EN))EN[e.dataset.t]=e.innerHTML});
  let lang='en';const subs=[];
  function stmt(){
    const st=document.getElementById('statement');const s=S[lang];
    st.innerHTML=s.statement.split(/\s+/).map(w=>`<span class="w${s.hl.includes(w.replace(/[.,;]/g,''))?' hl':''}">${w}</span>`).join(' ');
  }
  function set(l){
    lang=l==='es'?'es':'en';
    els.forEach(e=>{const k=e.dataset.t;const v=lang==='es'?(ES[k]??EN[k]):EN[k];if(e.innerHTML!==v)e.innerHTML=v});
    document.documentElement.lang=lang;
    const b=document.getElementById('langBtn');b.textContent=S[lang].toggle;b.setAttribute('aria-label',S[lang].toggleAria);
    stmt();subs.forEach(f=>f(lang));
  }
  let saved=null;try{saved=localStorage.getItem('pr_lang')}catch(e){}
  set(saved||'en');
  return {set,get:()=>lang,S:()=>S[lang],on:(f)=>subs.push(f),save:(l)=>{try{localStorage.setItem('pr_lang',l)}catch(e){}}};
})();
