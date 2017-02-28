window.onload = function() {
  var fileInput = document.getElementById('upload')
  var docText = document.getElementById('docText')
  var uploadBt = document.getElementById('upload-wrapper')
  var cancelBt = document.getElementById('cancel-button')
  var footer = document.getElementById('footer')
  var tooMenu = document.getElementById('toolMenu')
  var menuSet = document.getElementById('toolSet')
  var menuIcons = document.getElementsByClassName('toolToken')
  var words
  var text
  var lastClicked
  var clicked=false
  fileInput.addEventListener('change', function(e) {
     var file = fileInput.files[0]
     var textType = /text.*/

     if (file.type.match(textType)) {
         var reader = new FileReader()
         reader.onload = function(e) {
             text = reader.result
             var result = parser.subtitle({
               text: text,
               target: 'subtitlediv'
             })
             docText.innerHTML = result.outputString
             uploadBt.style.display='none'
             cancelBt.style.display='block'
             footer.style.position="none"
             footer.style.bottom="auto"
             words = document.getElementsByClassName('wordToken')
             addEventsToToken(words)
         }
         reader.readAsText(file)
     } else {
         fileDisplayArea.innerText = "File not supported!"
     }
  });

  var parser = {
    outputString: '',
    subtitle: function (input) {
      var str = []
        input.text.split('\r\n').forEach(function (sentence) {
          sentence.split(' ').forEach(function (word) {
          str.push("<span class='wordToken'")
          str.push('>')
          str.push(word)
          str.push('</span>')
          str.push(' ')
        })
      })
      parser.outputString = str.join('')
      return parser
    }
  }

  uploadBt.addEventListener('mouseover',function(){
    uploadBt.style.animation='onbt 0.6s forwards'
  })

  uploadBt.addEventListener('mouseout',function(){
    uploadBt.style.animation='outbt 0.6s forwards'
  })

  cancelBt.addEventListener('click',function(){
    uploadBt.style.display='block'
    cancelBt.style.display='none'
    docText.innerHTML=''
    footer.style.position="absolute"
    footer.style.bottom="0"
    tooMenu.style.animation="menuHide 0.5s forwards"
    menuSet.style.animation="fadeout 0.2s forwards"
  })

  cancelBt.addEventListener('mouseover',function(){
    cancelBt.style.animation='crson 0.6s forwards'
  })

  cancelBt.addEventListener('mouseout',function(){
    cancelBt.style.animation='crsout 0.6s forwards'
  })

  Array.prototype.forEach.call(menuIcons,function(item){
    item.addEventListener('mouseover',function(){
      item.style.animation='onword 0.6s forwards'
    })

    item.addEventListener('mouseout',function(){
      item.style.animation='outword 0.6s forwards'
    })
  })


  function addEventsToToken(wordLst){
    Array.prototype.forEach.call(wordLst,function(item,index){
      item.addEventListener('click',function(){
        var otherWords = document.getElementsByTagName('span')
        if(clicked==false||item.innerHTML.replace(/[^0-9a-z]/gi, '').toLowerCase()!=lastClicked.innerHTML.replace(/[^0-9a-z]/gi, '').toLowerCase()){
          var rect = item.getBoundingClientRect();
          Array.prototype.forEach.call(otherWords,function(itemX,index){
            if(itemX.innerHTML.replace(/[^0-9a-z]/gi, '').toLowerCase()!=item.innerHTML.replace(/[^0-9a-z]/gi, '').toLowerCase()){
              itemX.style.opacity="0.1"
            } else {
              itemX.style.opacity="1"
            }
          })
          clicked=true
          lastClicked=item
          for(count=index;count<wordLst.length;count++){
            var rectCurrent = wordLst[count].getBoundingClientRect();
            var next = wordLst[count+1].getBoundingClientRect();
            console.log(wordLst)
            if(next.top>rectCurrent.top){
              break
            }
          }
          tooMenu.style.animation="menuShow 0.5s forwards"
          menuSet.style.animation="fadein 1.5s forwards"
        } else {
          Array.prototype.forEach.call(otherWords,function(itemX,index){
            if(item.innerHTML.replace(/[^0-9a-z]/gi, '').toLowerCase()==lastClicked.innerHTML.replace(/[^0-9a-z]/gi, '').toLowerCase()){
              itemX.style.opacity="1"
            }
          })
          clicked=false
          tooMenu.style.animation="menuHide 0.5s forwards"
          menuSet.style.animation="fadeout 0.2s forwards"
        }
        item.style.opacity="1"
      })
      item.addEventListener('mouseover',function(){
        item.style.animation='onword 0.3s forwards'
      })
      item.addEventListener('mouseout',function(){
        //alert(item.innerHTML)
        item.style.animation='outword 0.3s forwards'
      })
    })
  }
}
