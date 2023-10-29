'use strict';

window.browser = (function () {
  return window.msBrowser || window.chrome || window.browser;
})();

const manifestData = chrome.runtime.getManifest();
const exclude_matches = manifestData.content_scripts[0].exclude_matches;

const selectFontElement = document.querySelector('#fonttools-font');

const notionStatus = document.querySelector('#notion');

const globalItem = document.querySelector('#global');

browser.storage.local.get(
  [
    'notion',
  ],
  function (data) {
    if (data.notion == undefined) {
      browser.storage.local.set({
        notion: true
      });
      notionStatus.checked = true;
    } else {
      if (data.notion == true) {
        notionStatus.checked = true;
      } else {
        notionStatus.checked = false;
      }
    }
  }
);

document.querySelectorAll("[type='checkbox']").forEach(function (el) {
  el.addEventListener('change', function () {
    if (this.checked == false) {
      browser.storage.local.set({
        [this.getAttribute('id')]: false
      });
    } else {
      browser.storage.local.set({
        [this.getAttribute('id')]: true
      });
    }
  });
});

selectFontElement.addEventListener('change', handleFont);

function handleFont() {
  browser.storage.local.set({
    font: 'Vazir'
  });
}

browser.storage.local.get(['custom_fonts', 'font'], function (fonts) {
  if (fonts.custom_fonts != undefined) {
    var OptGroup = document.createElement('optgroup');
    OptGroup.label = 'فونت های شما';
    OptGroup.id = 'custom-font';
    document.getElementById('fonttools-font').appendChild(OptGroup);
    Object.keys(fonts.custom_fonts).forEach(function (item) {
      var CustomFontOption = document.createElement('option');
      CustomFontOption.textContent = item;
      CustomFontOption.value = item;
      document.getElementById('custom-font').appendChild(CustomFontOption);
    });
  }
  selectFontElement.value = fonts.font;
  const choices = new Choices('#fonttools-font', {
    searchEnabled: false,
    shouldSort: false,
    noResultsText: 'نتیجه ای یافت نشد',
    itemSelectText: '!بِستَد دل و دین از من',
    googleEnabled: false
  });
});

var query = {
  active: true,
  currentWindow: true
};

function callback(tabs) {
  var currentTab = tabs[0]; // there will be only one in this array
  var url = new URL(currentTab.url).hostname;

  function ValidURL(str) {
    var pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?(#.*)?$',
      'i'
    ); // fragment locater
    if (!pattern.test(str)) {
      return false;
    } else {
      return true;
    }
  }

  if (!ValidURL(currentTab.url)) {
    document.querySelector('.global-section').style.display = 'none';
  }

  //Global Settings
  document.querySelector('.global-site').textContent = url.replace(
    /^www\./,
    ''
  );
  if (currentTab.favIconUrl == '' || currentTab.favIconUrl == undefined) {
    document.querySelector('.global-fav').remove();
  } else {
    document.querySelector('.global-fav').src = currentTab.favIconUrl;
  }

  globalItem.addEventListener('change', function () {
    if (this.checked == false) {
      browser.storage.local.get({
        sites: []
      }, function (result) {
        var sites = result.sites;
        sites = sites.filter(item => item !== url);
        browser.storage.local.set({
          sites: sites
        });
      });
    } else {
      browser.storage.local.get({
        sites: []
      }, function (result) {
        var sites = result.sites;
        sites.push(url);
        browser.storage.local.set({
          sites: sites
        });
      });
    }
    chrome.tabs.reload();
  });

  browser.storage.local.get('sites', function (result) {
    if (result.sites.includes(url)) {
      globalItem.checked = true;
    } else {
      globalItem.checked = false;
    }
  });

  //Developer Settings
  const link = document.querySelector('#developer');

  link.addEventListener('click', e => {
    e.preventDefault();
    if (url === 'www.linkedin.com') {
      browser.tabs.create({
        url: 'https://www.linkedin.com/in/mostafaalahyari/'
      });
    } else {
      browser.tabs.create({
        url: 'https://twitter.com/mimalef70'
      });
    }
  });
}

browser.tabs.query(query, callback);

window.addEventListener('load', function () {
  browser.storage.local.get(['font'], function (fonts) {
    document
      .querySelector(`.choices__list--dropdown [data-value='${fonts.font}']`)
      .classList.add('selected-item');
    const links = document.querySelectorAll('a.new-tab-font');
    for (const link of links) {
      link.addEventListener('mousedown', e => {
        e.preventDefault();

        browser.tabs.create({
          url: link.href
        });
      });
    }
  });

  selectFontElement.addEventListener('change', function () {
    var elems = document.querySelectorAll(
      'choices__list--dropdown .choices__item--choice'
    );
    [].forEach.call(elems, function (el) {
      el.classList.remove('selected-item');
    });
    document
      .querySelector(`.choices__list--dropdown [data-value='${this.value}']`)
      .classList.add('selected-item');
  });
});

const links = document.querySelectorAll('a.new-tab');
for (const link of links) {
  link.addEventListener('mousedown', e => {
    e.preventDefault();

    browser.tabs.create({
      url: link.href
    });
  });
}

document.querySelector('#optionpage').addEventListener('mousedown', e => {
  e.preventDefault();

  browser.tabs.create({
    url: '../../custom_font/index.html'
  });
});

// Show Global Section
chrome.tabs.query({
    url: exclude_matches,
    active: true,
    currentWindow: true
  },
  function (tabs) {
    if (!(tabs === undefined || tabs.length == 0)) {
      document.querySelector('.global-section').style.display = 'none';
    }
  }
);
