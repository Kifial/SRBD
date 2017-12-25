(function() {
  const itemList = $('#items-table')
  const backupList = $('#backups-table')
  const itemAddButton = $('#add-item')
  const itemInput = $('#item-input')
  const backupAddButton = $('#add-backup')
  const applyBackup = $('#apply-backup')

  let selectedItem

  fetch('/list').then(response => response.json()).then(data => {
    setItems(data)
  })

  fetch('/backups').then(response => response.json()).then(data => {
    setBackups(data)
    const backupItems = $('#backups-table .table-item')
    backupItems.on('click', (e) => {
      selectedItem = e.target
    })
  })

  itemAddButton.on('click', (e) => {
    const value = itemInput.val()
    itemInput.val('')

    console.log(value)

    fetch('/list', {
      method: 'POST',
      body: JSON.stringify({
        text: value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json()).then(data => {
      setItems(data)
    }).catch(e => {
      console.log(e)
    })
  })

  backupAddButton.on('click', (e) => {
    fetch('/backup', {
      method: 'POST'
    }).then(response => response.json()).then(data => {
      setBackups(data)
    }).catch(e => {
      console.log(e)
    })
  })

  applyBackup.on('click', (e) => {
    fetch(`/backup/${selectedItem.innerHTML}`).then(response => response.json()).then(data => {
      setItems(data)
    })
  })

  function setItems(items) {
    console.log(items)
    itemList.html('')
    console.log(itemList)
    items.forEach(item => {
      const el = document.createElement('div')
      el.className = 'table-item'
      el.innerHTML = item.text
      itemList.append(el)
    })
  }

  function setBackups(backups) {
    backupList.html('')
    backups.forEach(backup => {
      const el = document.createElement('div')
      el.className = 'table-item'
      el.innerHTML = backup
      backupList.append(el)
    })
  }
})()
