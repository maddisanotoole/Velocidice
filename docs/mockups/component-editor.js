/* Mockup-only component editor. The live application's theme system is untouched. */
const COMPONENT_REVIEW_KEY = 'velocidice.mockups.component-review.v2';
const componentDefinitions = [
  ['start_button','Start Game','menu','start'],['confirm_button','Confirm / Use theme','menu','start'],
  ['menu_selection','Menu selection','menu','stats'],['rules_button','Rules button','menu','rules'],
  ['stats_button','Stats button','menu','stats'],['theme_button','Theme button','menu','menu-neutral'],
  ['your_turn','Your turn banner','game','rules'],['opponent_turn','Opponent turn banner','game','stats'],
  ['reroll_button','Hold & Reroll button','game','rules'],['bank_button','Bank & End Turn button','game','start'],
  ['available','Your available dice','dice','dice'],['selected','Your selected dice','dice','dice'],
  ['opponent_available','Opponent available dice','dice','opponent'],['opponent_selected','Opponent selected dice','dice','opponent'],
  ['held','Held dice','dice','held'],['selection_border','Selected outline / tick','dice','selection-edge'],
  ['active_score','Active score highlight','status','active-score'],['point_increase','Point increases','status','success'],
  ['success_message','Success notification','status','success'],['error_message','Error / Farkle notification','status','danger'],
  ['warning_message','Warning notification','status','warning'],['neutral_message','Neutral notification text','status','menu-ink'],
  ['focus_ring','Keyboard focus ring','status','start'],['disabled_surface','Disabled control background','status','menu-neutral'],
  ['disabled_text','Disabled control text','status','menu-muted'],['menu_surface','Menu panel','surfaces','menu-panel'],
  ['menu_text','Menu text','surfaces','menu-ink'],['table_surface','Table base colour','surfaces',null]
];
const timberExtraColours = [
  ['Walnut','#805938'],['Dark walnut','#503725'],['Espresso','#382a22'],['Cocoa','#695043'],
  ['Warm taupe','#8a705b'],['Mushroom','#a58c77'],['Honey caramel','#d5ae72'],['Burnished gold','#d2ae5f'],
  ['Sandstone','#e1c39b'],['Cream','#fff5e7'],['Linen','#ece0cc'],['Slate blue','#587a87'],
  ['Denim','#456584'],['Storm blue','#708797'],['Smoky plum','#79617c'],['Aubergine','#584257'],
  ['Muted teal','#467978'],['Deep teal','#2b5655'],['Olive','#52633d'],['Soft sage','#a4b090'],
  ['Terracotta','#a54827'],['Clay rose','#b5796b'],['Copper','#a86e40'],['Charcoal','#373537']
];
function normalizeColour(value) {
  value=value.trim().toLowerCase();
  if(/^#[0-9a-f]{3}$/.test(value))return '#'+value.slice(1).split('').map(c=>c+c).join('');
  if(/^#[0-9a-f]{6}$/.test(value))return value;
  if(value==='white')return '#ffffff';if(value==='black')return '#000000';
  const m=value.match(/^rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)/);
  return m?'#'+m.slice(1,4).map(x=>(+x).toString(16).padStart(2,'0')).join(''):null;
}
function colourLuminance(hex) { const a=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return a[0]*.2126+a[1]*.7152+a[2]*.0722; }
function readableInk(hex) {
  const background=colourLuminance(hex),dark=colourLuminance('#171717');
  const darkContrast=(Math.max(background,dark)+.05)/(Math.min(background,dark)+.05);
  return darkContrast>=1.05/(background+.05)?'#171717':'#ffffff';
}
let componentReview={themes:{}};
try{const stored=JSON.parse(localStorage.getItem(COMPONENT_REVIEW_KEY));if(stored&&stored.themes&&typeof stored.themes==='object')componentReview=stored;}catch{}
if(!componentReview.confirmedColours||typeof componentReview.confirmedColours!=='object')componentReview.confirmedColours={};
const defaultTables={current:'#18181b',felt:'#0c3e29',timber:'#d1a067',midnight:'#102e50',garden:'#a5bb98',vegas:'#590e1b',arcade:'#160c30',cottage:'#e8e0c9',christmas:'#103427',halloween:'#24132f',tablecloth:'#f8e7d5'};
Object.assign(defaultTables,Object.fromEntries(extraThemeConcepts.map(c=>[c.id,c.table])));
const componentPalettes={};
function storeComponents(){try{localStorage.setItem(COMPONENT_REVIEW_KEY,JSON.stringify(componentReview))}catch{}}
const componentOriginals={};
function addCustomColour(id,hex){
  hex=normalizeColour(hex);if(!hex)return;
  const confirmed=componentReview.confirmedColours[id]||(componentReview.confirmedColours[id]=[]);
  if(!confirmed.includes(hex))confirmed.push(hex);
  if(!componentPalettes[id].some(option=>option[1]===hex))componentPalettes[id].push(['Custom '+hex,hex]);
  const card=[...grid.children].find(card=>card.dataset.theme===id);
  for(const select of card.querySelectorAll('[data-component]')){
    if(![...select.options].some(option=>option.value===hex)){
      const option=document.createElement('option');option.value=hex;option.textContent='Custom '+hex;select.append(option);
    }
  }
}
function createSwatchDropdown(select,label,id,key) {
  select.hidden=true;
  const root=document.createElement('div');root.className='component-swatch-picker';
  const swatches=document.createElement('div');swatches.className='component-swatch-grid';swatches.setAttribute('role','group');swatches.setAttribute('aria-label',label+' theme colours');
  const actions=document.createElement('div');actions.className='component-swatch-actions';
  const reset=document.createElement('button');reset.type='button';reset.className='component-reset';reset.textContent='Reset';reset.setAttribute('aria-label','Reset '+label+' to original');
  const more=document.createElement('button');more.type='button';more.className='component-more';more.textContent='More colours…';more.setAttribute('aria-label','More colours for '+label);
  const picker=document.createElement('input');picker.type='color';picker.className='component-native-colour';picker.tabIndex=-1;picker.setAttribute('aria-label',label+' custom colour');
  const current=document.createElement('span');current.className='component-current-colour';current.setAttribute('aria-live','polite');
  const draft=document.createElement('div');draft.className='component-colour-draft';draft.hidden=true;
  const draftChip=document.createElement('i');draftChip.setAttribute('aria-hidden','true');
  const draftText=document.createElement('span');
  const confirm=document.createElement('button');confirm.type='button';confirm.className='component-more';confirm.textContent='Add colour';
  const cancel=document.createElement('button');cancel.type='button';cancel.className='component-reset';cancel.textContent='Cancel';
  draft.append(draftChip,draftText,confirm,cancel);
  actions.append(more,reset,current,picker);root.append(swatches,actions,draft);
  function choose(value){select.value=value;select.dispatchEvent(new Event('change'));}
  function showDraft(){draftChip.style.background=picker.value;draftText.textContent=picker.value+' · not added';}
  reset.onclick=()=>{draft.hidden=true;choose(componentOriginals[id][key]);};
  more.onclick=()=>{picker.value=resolvedComponent(id,key);draft.hidden=false;showDraft();try{if(picker.showPicker)picker.showPicker();else picker.click();}catch{picker.click();}};
  picker.oninput=showDraft;
  picker.onchange=showDraft;
  confirm.onclick=()=>{const hex=picker.value;addCustomColour(id,hex);draft.hidden=true;choose(hex);};
  cancel.onclick=()=>{draft.hidden=true;more.focus();};
  const entries=new Map();
  function sync(){
    for(const option of select.options){
      let entry=entries.get(option.value);
      if(!entry){const button=document.createElement('button');button.type='button';button.className='component-colour-swatch';
        button.title=option.textContent;button.setAttribute('aria-label',label+': '+option.textContent);
        button.onclick=()=>choose(option.value);swatches.append(button);entry={button};entries.set(option.value,entry);}
      const match=option.value==='match_available';
      const hex=match?resolvedComponent(id,key==='opponent_selected'?'opponent_available':'available'):option.value;
      entry.button.style.background=hex;entry.button.style.color=readableInk(hex);
      entry.button.classList.toggle('match-available-swatch',match);
      entry.button.textContent=option.value===select.value?'✓':match?'↔':'';
      entry.button.setAttribute('aria-pressed',String(option.value===select.value));
    }
    current.textContent=select.value==='match_available'?'Match available dice':select.value;
    if(draft.hidden)picker.value=resolvedComponent(id,key);
  }
  select.syncSwatches=sync;sync();return root;
}
function resolvedComponent(id,key){const values=componentReview.themes[id];const value=values[key];if(value==='match_available')return values[key==='opponent_selected'?'opponent_available':'available'];return value;}
function applyComponents(card){const id=card.dataset.theme,values=componentReview.themes[id];for(const root of card.querySelectorAll('.mock-menu,.game,.status-preview'))for(const [key]of componentDefinitions){const hex=resolvedComponent(id,key);root.style.setProperty('--component-'+key,hex);root.style.setProperty('--component-'+key+'-ink',readableInk(hex));}
  for(const root of card.querySelectorAll('.game,.mock-menu')){
    if(values.table_surface!==defaultTables[id])root.style.background=values.table_surface;
    else root.style.removeProperty('background');
  }
  const roleKey=card.querySelector('.role-key');roleKey.replaceChildren();
  for(const [key,label]of componentDefinitions){const item=document.createElement('span');const chip=document.createElement('i');chip.style.setProperty('--role',`var(--component-${key})`);item.append(chip,document.createTextNode(label));roleKey.append(item);}
  card.querySelector('.palette-key').textContent='Independent component colours · changes update every preview immediately';
  card.querySelector('.palette-review').textContent='Each component has its own property. Every dropdown offers the same shared theme palette. Selected dice may follow their own available-die colour, or use a separate fill. Outline/tick still indicates selection.';
  for(const select of card.querySelectorAll('[data-component]')){const key=select.dataset.component;select.value=values[key];select.previousElementSibling.style.background=resolvedComponent(id,key);select.syncSwatches?.();}
}
for(const card of grid.children){
 const id=card.dataset.theme,game=card.querySelector('.game'),menu=card.querySelector('.mock-menu'),status=card.querySelector('.status-preview');
 const menuStyle=getComputedStyle(menu),gameStyle=getComputedStyle(game),statusStyle=getComputedStyle(status);
 const initial={};for(const [key,,section,token]of componentDefinitions){const styles=section==='status'?statusStyle:section==='menu'?menuStyle:gameStyle;initial[key]=key==='table_surface'?defaultTables[id]:normalizeColour(styles.getPropertyValue('--'+token))||'#ffffff';}
 initial.selected=id==='current'?'#facc15':'match_available';initial.opponent_selected=id==='current'?'#facc15':'match_available';
 const original={...initial};
 const probe=document.createElement('div');probe.className=id;probe.hidden=true;document.body.append(probe);
 const baseline=getComputedStyle(probe);
 for(const [key,token]of [['start_button','start'],['confirm_button','start'],['menu_selection','stats'],['rules_button','rules'],['stats_button','stats'],['your_turn','rules'],['opponent_turn','stats'],['reroll_button','rules'],['bank_button','start'],['focus_ring','start']])original[key]=normalizeColour(baseline.getPropertyValue('--'+token))||initial[key];
 original.held=reviewedPalettes[id].held;probe.remove();componentOriginals[id]=original;
 if(!componentReview.themes[id]||typeof componentReview.themes[id]!=='object')componentReview.themes[id]=initial;
 const values=componentReview.themes[id];for(const [key]of componentDefinitions){if(values[key]!=='match_available'&&!normalizeColour(String(values[key]||'')))values[key]=initial[key];if(values[key]==='match_available'&&!['selected','opponent_selected'].includes(key))values[key]=initial[key];}
 const palette=[],seen=new Set();function add(label,value){const hex=normalizeColour(value);if(hex&&!seen.has(hex)){seen.add(hex);palette.push([label,hex]);}}
 add('White','#ffffff');add('Ink','#171717');
 if(id==='timber')for(const [name,hex]of timberExtraColours)add(name,hex);
 for(const [name,hex]of themeAlternatives[id])add(name,hex);
 for(const group of variantGroups[id]||[])for(const option of group.options)add(option[0],option[1]);
 for(const [key,title]of componentDefinitions)if(initial[key]!=='match_available')add(title+' original',initial[key]);
 for(const [key,title]of componentDefinitions)if(original[key]!=='match_available')add(title+' baseline',original[key]);
 // Discard old picker-drag colours; retain presets and explicitly confirmed customs.
 const confirmed=componentReview.confirmedColours[id];
 if(Array.isArray(confirmed))for(const hex of confirmed)add('Custom '+hex,hex);
 for(const [key]of componentDefinitions)if(values[key]!=='match_available'&&!seen.has(values[key]))values[key]=original[key];
 componentPalettes[id]=palette;
 const old=card.querySelector('.variant-controls'),decision=old.querySelector('.decision-button');old.replaceChildren();old.classList.add('component-controls');
 const intro=document.createElement('p');intro.className='component-intro';intro.textContent=`${palette.length} colours available for every component. Open a section to customise it.`;old.append(intro);
 for(const [section,title]of [['menu','Main menu buttons & selection'],['game','Turn banners & game buttons'],['dice','Dice faces & selection'],['status','Scores, notifications & states'],['surfaces','Surfaces & text']]){
  const details=document.createElement('details');details.open=section==='dice';const summary=document.createElement('summary');summary.textContent=title;details.append(summary);const fields=document.createElement('div');fields.className='component-fields';details.append(fields);
  for(const [key,label,group]of componentDefinitions){if(group!==section)continue;const field=document.createElement('div');field.className='component-field';const name=document.createElement('span');name.textContent=label;const property=document.createElement('code');property.textContent=key;name.append(property);field.append(name);const swatch=document.createElement('i');swatch.setAttribute('aria-hidden','true');field.append(swatch);const select=document.createElement('select');select.dataset.component=key;
   if(['selected','opponent_selected'].includes(key)){const option=document.createElement('option');option.value='match_available';option.textContent='Match available dice';select.append(option);}
   for(const [label,hex]of palette){const option=document.createElement('option');option.value=hex;option.textContent=label+' · '+hex;select.append(option);}
   select.value=values[key];select.onchange=()=>{values[key]=select.value;applyComponents(card);storeComponents()};field.append(select,createSwatchDropdown(select,label,id,key));fields.append(field);
  }old.append(details);
 }
 const confirmExample=document.createElement('p');confirmExample.className='component-confirm-example';confirmExample.textContent='Use this theme';status.append(confirmExample);
 const reset=document.createElement('button');reset.type='button';reset.className='decision-button';reset.textContent='Reset to original';
 reset.setAttribute('aria-label',`Reset ${themes.find(theme=>theme[0]===id)[1]} to original colours`);
 reset.onclick=()=>{
   for(const [key,value]of Object.entries(original))values[key]=value;
   applyComponents(card);storeComponents();
 };
 old.append(reset,decision);applyComponents(card);
}
storeComponents();
help.textContent='Each component now has an independent colour property. Every component in a theme shares the same palette. Changes and decisions are saved in this browser for this mockup only.';
copyChoices.onclick=async()=>{const lines=['VelociDice component choices'];for(const [id,title]of themes){lines.push(`\n${review.decided.includes(id)?'DECIDED':'REVIEW'} | ${title}`);for(const [key,label]of componentDefinitions){const value=componentReview.themes[id][key];const name=value==='match_available'?'Match available dice':componentPalettes[id].find(p=>p[1]===value)?.[0]||value;lines.push(`  ${key}: ${name} (${value})`);}}const text=lines.join('\n');try{await navigator.clipboard.writeText(text);copyResult.textContent='Copied component choices. Paste them into our chat.';exportText.hidden=true}catch{exportText.value=text;exportText.hidden=false;exportText.focus();exportText.select();copyResult.textContent='Copy the component choices below.'}};

// Keep controls beside the previews, with optional focus on a single screen.
for(const card of grid.children){
 const workspace=document.createElement('section');workspace.className='theme-preview-workspace';workspace.setAttribute('aria-label','Live theme previews');
 const tabs=document.createElement('div');tabs.className='preview-screen-tabs';tabs.setAttribute('role','group');tabs.setAttribute('aria-label','Preview screen');
 const hint=document.createElement('p');hint.className='preview-workspace-hint';hint.textContent='Scroll sideways for all four previews, or choose one to keep it in view while editing.';
 const columns=document.createElement('div');columns.className='theme-preview-columns';columns.dataset.screen='all';
 const mockups=[...card.querySelectorAll(':scope > .mockup-column')];
 for(const column of mockups)columns.append(column);
 for(const [value,label]of [['all','All screens'],['0','Menu'],['1','Your turn'],['2','Opponent turn'],['3','Points & status']]){
  const button=document.createElement('button');button.type='button';button.textContent=label;button.setAttribute('aria-pressed',String(value==='all'));
  button.onclick=()=>{columns.dataset.screen=value;mockups.forEach((column,index)=>column.hidden=value!=='all'&&String(index)!==value);for(const other of tabs.children)other.setAttribute('aria-pressed',String(other===button));workspace.scrollLeft=0;};tabs.append(button);
 }
 workspace.append(tabs,hint,columns);card.querySelector('.component-controls').after(workspace);
}
