const update = document.querySelector('#update-button')
update.addEventListener('click' ,()=>{
  console.log("pressed");
  fetch('/memes/3', {
    method: 'PATCH',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({
      caption: 'UPdated',
      //quote: 'I find your lack of faith disturbing.'
      url:'https://gumlet.assettype.com/freepressjournal%2F2021-02%2F762573fe-039c-4944-a426-15037303a58a%2Fh.png?rect=1%2C0%2C1205%2C678&w=750&dpr=1.5'
    })
  })
});