/*
  Author : Ziyao Wang
  Created : 2017 Feb

  Project : viz

*/

window.onload = function() {
    //declare variables

    //file upload button
    var fileInput = document.getElementById('upload')

    //where to replace innerHTML with doc contents
    var docText = document.getElementById('docText')

    //wrappers
    var uploadBt = document.getElementById('upload-wrapper')
    var cancelBt = document.getElementById('cancel-button')

    var footer = document.getElementById('footer')

    //tool menu associates
    var tooMenu = document.getElementById('toolMenu')
    var menuSet = document.getElementById('toolSet')
    var menuIcons = document.getElementsByClassName('toolToken')

    //other required for functioning
    var words
    var text
    //check clicked words
    var lastClicked = ""
    var clicked = false

    //hash table/ dictionary functions for optimizing the efficiency for DOM minipulation
    //IMPORTANT: No need to traverse the DOM everytime, every word's text is stored as key and an array contains all nodes with the text
    //just call dictionary_sameword[string]    this string must be in lower case, and all special char must be removed. use string.toLowerCase().replace(/[^a-zA-Z ]/g, "")
    var dictionary_sameword = {}

    //preprocess the doc text to create the hashtable.
    function preprocess(spanWords) {
        Array.prototype.forEach.call(spanWords, function(ele, idx) {
            var str = ele.innerHTML.toLowerCase().replace(/[^a-zA-Z ]/g, "")
            if (!dictionary_sameword.hasOwnProperty(str)) {
                var arr = Array()
                arr.push(ele)
                dictionary_sameword[str] = arr
            } else {
                dictionary_sameword[str].push(ele)
            }
        })
        //function doc_process(document)
        //*****this function is to process the categorization process of this doc. Create a dictionary for different categories for optimization

        //function highlight(class_lis)
        //*****highlight different categories
    }



    //add event listener for upload button.
    fileInput.addEventListener('change', function(e) {
        var file = fileInput.files[0]
        var textType = /text.*/

        if (file.type.match(textType)) {
            var reader = new FileReader()
            //process .txt
            reader.onload = function(e) {
                text = reader.result
                var result = parser.subtitle({
                    text: text,
                    target: 'subtitlediv'
                })

                //change the UI elements
                docText.innerHTML = result.outputString
                uploadBt.style.display = 'none'
                cancelBt.style.display = 'block'
                footer.style.position = "none"
                footer.style.bottom = "auto"

                //add event listener to each single word as span tag
                words = document.getElementsByClassName('wordToken')
                addEventsToToken(words)
            }
            reader.readAsText(file)
        } else {
            //file not support error
            fileDisplayArea.innerText = "File not supported!"
        }
    });


    //add listeners to each word
    function addEventsToToken(wordLst) {
        //preprocessing
        preprocess(wordLst)
        //add event listener
        Array.prototype.forEach.call(wordLst, function(item, index) {
            item.addEventListener('click', function() {
                //normalize string text
                var str = item.innerHTML.toLowerCase().replace(/[^a-zA-Z ]/g, "")
                //check if it has not clicked or it equals to last clicked
                if (clicked == false || str != lastClicked) {
                    if (lastClicked != "" && str != lastClicked) {
                        Array.prototype.forEach.call(dictionary_sameword[lastClicked], function(itemX, index) {
                            itemX.style.color = ""
                        })
                    }
                    docText.style.color = "#353535"
                    Array.prototype.forEach.call(dictionary_sameword[str], function(itemX, index) {
                        itemX.style.color = "#ffffff"
                    })
                    clicked = true
                    lastClicked = str
                    tooMenu.style.animation = "menuShow 0.5s forwards"
                    menuSet.style.animation = "fadein 1.5s forwards"
                } else {
                    Array.prototype.forEach.call(dictionary_sameword[str], function(itemX, index) {
                        itemX.style.color = ""
                    })
                    docText.style.color = "#ffffff"
                    clicked = false
                    tooMenu.style.animation = "menuHide 0.5s forwards"
                    menuSet.style.animation = "fadeout 0.2s forwards"
                }
            })

            item.addEventListener('mouseover', function() {
                item.style.animation = 'onword 0.3s forwards'
            })

            item.addEventListener('mouseout', function() {
                //alert(item.innerHTML)
                item.style.animation = 'outword 0.3s forwards'
            })
        })
    }

    //call when reader init. append each word as span to docText.
    var parser = {
        outputString: '',
        subtitle: function(input) {
            var str = []
            input.text.split('\r\n').forEach(function(sentence) {
                sentence.split(' ').forEach(function(word) {
                    //create span tag for each word
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

    //add animation to upload button
    uploadBt.addEventListener('mouseover', function() {
        uploadBt.style.animation = 'onbt 0.6s forwards'
    })

    uploadBt.addEventListener('mouseout', function() {
        uploadBt.style.animation = 'outbt 0.6s forwards'
    })

    //add animation and click function to cancel button
    cancelBt.addEventListener('click', function() {
        uploadBt.style.display = 'block'
        cancelBt.style.display = 'none'
        docText.innerHTML = ''
        footer.style.position = "absolute"
        footer.style.bottom = "0"
        tooMenu.style.animation = "menuHide 0.5s forwards"
        menuSet.style.animation = "fadeout 0.2s forwards"
    })

    cancelBt.addEventListener('mouseover', function() {
        cancelBt.style.animation = 'crson 0.6s forwards'
    })

    cancelBt.addEventListener('mouseout', function() {
        cancelBt.style.animation = 'crsout 0.6s forwards'
    })

    //add click listener to menu options.
    //*****call your function here for different tasks here*****
    Array.prototype.forEach.call(menuIcons, function(item) {

        item.addEventListener('click', function() {
            var menu = item.innerHTML.toLowerCase()
            // delete,find/replace,cate,asso
            if (menu == "delete") {
                // function
            } else if (menu == "find / replace") {
                // function
            } else if (menu == "categorize") {
                // function
            } else if (menu == "associate") {
                // function
            }
        })

        //add animations to options
        item.addEventListener('mouseover', function() {
            item.style.animation = 'onword 0.6s forwards'
        })

        item.addEventListener('mouseout', function() {
            item.style.animation = 'outword 0.6s forwards'
        })
    })


}
