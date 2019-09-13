/* global localStorage, prompt */

const SDK = require('dat-sdk')

const { Hypercore } = SDK()

const hypertrie = require('hypertrie')

$('#creator').addEventListener('click', onCreator)
$('#viewer').addEventListener('click', onViewer)
$('#edit').addEventListener('submit', onEdit)

function $ (selector) {
  return document.querySelector(selector)
}

function loadExisting (url) {
  const feed = new Hypercore(url, {valueEncoding: 'binary', sparse: false})

	feed.on('peer-add', (peer) => {
		log('got peer', peer)
	})

  const trie = hypertrie(null, { feed })

  window.trie = trie

  trie.ready(() => {
    log('Loaded trie', url)
    viewTrie()
  })
}

function createNew () {
  const feed = new Hypercore(null, {valueEncoding: 'binary', sparse: false})

	feed.on('peer-add', (peer) => {
		log('got peer', peer)
	})

  const trie = hypertrie(null, { feed })

  window.trie = trie

  trie.ready(() => {
    const url = `dat://${feed.key.toString('hex')}`

    localStorage.setItem('trie_url', url)

    log('Created trie', url)
    viewTrie()
  })
}

function onCreator () {
  let url = localStorage.getItem('trie_url')

  if (url) loadExisting(url)
  else createNew()

  showEdit()
  hideSelector()
}

function onViewer () {
  const url = prompt('Please enter the Dat URL for the trie')

  loadExisting(url)
  hideSelector()
}

function onEdit (e) {
  e.preventDefault()
  const key = $('#edit [name="key"]').value
  const value = $('#edit [name="value"]').value
  log('writing', key, value)
  window.trie.put(key, value, (err) => {
    if (err) log('Error writing', err.message)
    else log('wrote', key, '-', value)
  })
}

function log (...args) {
  console.log(...args)
  $('#info').innerHTML += `<div>${new Date()} ${args.join(' ')}</div>`
}

function hideSelector () {
	$('#selector').classList.add('hidden')
}

function showEdit () {
  $('#edit').classList.remove('hidden')
}

function viewTrie () {
  window.trie.list('', (err, results) => {
  	if(err) return log('Error reading from trie', err.message)
  	for(let {key, value} of results) {
		log('key:', key, 'value:', Buffer.from(value).toString('utf8'))
  	}
  })
}
