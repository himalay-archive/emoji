;(function () {
  'use strict'

  // TODO: This shit needs to be fetched dynamically from http://unicode.org/emoji/charts/emoji-list.html
  // for now emojis is globally defined in emojis.js
  const emojis = window.emojis || []
  let typingTimer
  const f = new Fuse(emojis, { keys: ['name', 'keywords'] })

  document.querySelector('.filter').addEventListener('keyup', filterChangeHandler)
  document.addEventListener('click', emojiClickHandler)

  displayEmoji(emojis)

  function filterChangeHandler (e) {
    const filterText = e.target.value
    clearTimeout(typingTimer)
    if (filterText) {
      typingTimer = setTimeout(function () {
        displayEmoji(f.search(filterText))
        getdango(filterText)
      }, 500)
    } else {
      displayEmoji(emojis)
      getdango('')
    }
  }

  function emojiClickHandler (e) {
    if (e.target.tagName === 'BUTTON') copyTextToClipboard(e.target.textContent)
  }

  function displayEmoji (arr) {
    const emojiWrapper = document.querySelector('.emoji-wrapper')
    let emojiHTML = ''

    for (let i = 0, l = arr.length; i < l; i++) {
      emojiHTML += '<button class="emoji" title="' + arr[i].name + '">' + arr[i].emoji + '</button>'
    }

    emojiWrapper.innerHTML = emojiHTML
  }

  function copyTextToClipboard (text) {
    const textArea = Object.assign(document.createElement('textarea'), { value: text })

    document.body.appendChild(textArea)

    textArea.select()
    try {
      document.execCommand('copy')
    } catch (err) {
      console.error('Could not copy', err)
    }

    document.body.removeChild(textArea)
  }

  function getdango (q) {
    let aimoji = document.querySelector('.aimoji')

    fetch(`https://api.getdango.com/api/emoji?q=${q}`)
      .then(res => res.json())
      .then(({ results }) => results.map((e, i) => e.text))
      .then(emojis => aimoji = Object.assign(aimoji, { textContent: emojis.join(''), title: q }))
      .catch(console.error)
  }
})()
