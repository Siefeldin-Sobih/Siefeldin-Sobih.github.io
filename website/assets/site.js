const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu?.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!expanded));
  navigation.classList.toggle('open', !expanded);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
    menu.focus();
  }
});
document.querySelector('.print-button')?.addEventListener('click', () => window.print());
// One data source, three focused CV views.
const experienceTabs = [...document.querySelectorAll('[data-experience-view]')];
if (experienceTabs.length) {
  const allowedViews = experienceTabs.map(tab => tab.dataset.experienceView);
  const printButton = document.querySelector('.print-button');
  function showExperience(view, pushHistory = false) {
    if (!allowedViews.includes(view)) view = 'complete';
    for (const tab of experienceTabs) {
      const selected = tab.dataset.experienceView === view;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
    }
    if (printButton) printButton.textContent = view === 'complete' ? 'Print complete CV ↗' : 'Print ' + view + ' view ↗';
    if (pushHistory) {
      const url = new URL(location.href);
      url.searchParams.set('view', view);
      url.hash = '';
      history.pushState(null, '', url);
    }
  }
  for (const [index, tab] of experienceTabs.entries()) {
    tab.addEventListener('click', () => showExperience(tab.dataset.experienceView, true));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % experienceTabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + experienceTabs.length) % experienceTabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = experienceTabs.length - 1;
      else return;
      event.preventDefault();
      experienceTabs[next].focus();
      showExperience(experienceTabs[next].dataset.experienceView, true);
    });
  }
  const viewFromUrl = () => {
    const url = new URL(location.href);
    const fromAnchor = url.hash.slice(1).split('-')[0];
    const view = url.searchParams.get('view') || (allowedViews.includes(fromAnchor) ? fromAnchor : 'complete');
    showExperience(view);
  };
  window.addEventListener('popstate', viewFromUrl);
  window.addEventListener('hashchange', viewFromUrl);
  viewFromUrl();
}
const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('[data-category]')];
const search = document.querySelector('#work-search');
if (cards.length) {
  const known = ['All', ...cards.map(card => card.dataset.category)];
  const requested = new URLSearchParams(location.search).get('type');
  let selected = known.includes(requested) ? requested : 'All';
  function update() {
    const term = (search?.value || '').trim().toLocaleLowerCase();
    let count = 0;
    for (const card of cards) {
      card.hidden = !((selected === 'All' || card.dataset.category === selected) && card.dataset.search.toLocaleLowerCase().includes(term));
      if (!card.hidden) count++;
    }
    for (const filter of filters) {
      const active = filter.dataset.filter === selected;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    }
    document.querySelector('.empty-results').hidden = count > 0;
    document.querySelector('#work-count').textContent = count + (count === 1 ? ' item shown' : ' items shown');
  }
  for (const filter of filters) filter.addEventListener('click', () => {
    selected = filter.dataset.filter;
    const url = new URL(location.href);
    selected === 'All' ? url.searchParams.delete('type') : url.searchParams.set('type', selected);
    history.replaceState(null, '', url);
    update();
  });
  search?.addEventListener('input', update);
  document.querySelector('#clear-filters')?.addEventListener('click', () => {
    selected = 'All'; search.value = '';
    const url = new URL(location.href); url.searchParams.delete('type');
    history.replaceState(null, '', url); update(); search.focus();
  });
  window.addEventListener('popstate', () => {
    const type = new URLSearchParams(location.search).get('type');
    selected = known.includes(type) ? type : 'All'; update();
  });
  update();
}


// Publication filters are independent of project filters.
const paperButtons = [...document.querySelectorAll('[data-paper-filter]')];
const paperCards = [...document.querySelectorAll('[data-paper-status]')];
if (paperButtons.length) {
  document.querySelector('.publication-filters').hidden = false;
  function filterPapers(status) {
    if (!paperButtons.some(button => button.dataset.paperFilter === status)) status = 'all';
    let count = 0;
    for (const card of paperCards) {
      card.hidden = status !== 'all' && card.dataset.paperStatus !== status;
      if (!card.hidden) count++;
    }
    for (const button of paperButtons) {
      const active = button.dataset.paperFilter === status;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    }
    document.querySelector('#publication-count').textContent = count + (count === 1 ? ' paper' : ' papers');
    document.querySelector('#publication-empty').hidden = count !== 0;
  }
  for (const button of paperButtons) button.addEventListener('click', () => filterPapers(button.dataset.paperFilter));
  filterPapers('all');
}
