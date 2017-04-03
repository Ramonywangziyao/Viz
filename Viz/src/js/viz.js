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
    var menuItems = menuSet.getElementsByTagName('li')
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

    var delete_set = {}

    var replace_back = document.getElementById('replaceWindow')
    var replace_field = document.getElementById('replacetextfield')
    var replaceConfirm = document.getElementById('confirmButton')
    var replaceClose = document.getElementById('cancelInput')
    var replaceTextField = document.getElementById('replaceWordField')

    var categorize_back = document.getElementById('categorizeWindow')
    var categorize_field = document.getElementById('categorizeRadioField')
    var categorizeConfirm = document.getElementById('confirmButton_Categorize')
    var categorizeClose = document.getElementById('cancelInput_Categorize')
    var categorizeTextField = document.getElementById('categorizeWordField')

    //preprocess the doc text to create the hashtable.
    function preprocess(spanWords) {
        Array.prototype.forEach.call(spanWords, function(ele, idx) {
            var str = ele.innerHTML.toLowerCase().replace(/[^a-zA-Z ]/g, "")
            if (!dictionary_sameword.hasOwnProperty(str)) {
                var arr = Array()
                arr.push(ele)
                dictionary_sameword[str] = arr
                delete_set[str] = false
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
                    docText.style.color = "#1f1f20"
                    Array.prototype.forEach.call(dictionary_sameword[str], function(itemX, index) {
                        itemX.style.color = "#ffffff"
                    })
                    clicked = true
                    lastClicked = str
                    tooMenu.style.animation = "menuShow 0.5s forwards"
                    menuSet.style.animation = "fadein 1.5s forwards"
                    cancelBt.style.display = "none"
                    //modify the menu delete for the clicked word
                    if (delete_set[lastClicked] == false) {
                        menuItems[0].innerHTML = "Delete"
                    } else {
                        menuItems[0].innerHTML = "Undelete"
                    }
                    onEditing = true
                } else {
                    cancelEdit()
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

    function cancelEdit(){
        Array.prototype.forEach.call(dictionary_sameword[lastClicked], function(itemX, index) {
            itemX.style.color = ""
        })
        docText.style.color = "#ffffff"
        clicked = false
        tooMenu.style.animation = "menuHide 0.5s forwards"
        menuSet.style.animation = "fadeout 0.2s forwards"
        onEditing = false
        cancelBt.style.display = "block"
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

    //replace button confirm button clicked
    replaceConfirm.addEventListener('click', function() {
        //hide the replace  window
        replace_back.style.display = "none"
        replace_field.style.display = "none"
        var newStr = replaceTextField.value.toLowerCase().replace(/[^a-zA-Z ]/g, "")

        //modify the text for each origin node
        Array.prototype.forEach.call(dictionary_sameword[lastClicked], function(itemX, index) {
            var val = itemX.innerHTML.charAt(itemX.innerHTML.length-1)
            //check for ending special characters
            itemX.innerHTML = val.match(/[^a-zA-Z ]/g) ? replaceTextField.value+val : replaceTextField.value
            itemX.style.textDecoration = "none"
            itemX.style.fontStyle = "italic"
            itemX.style.opacity = "1"
        })

        menuItems[0].innerHTML = "Delete"
        //update the dictionary for the word
        dictionary_sameword[newStr] = dictionary_sameword[lastClicked]
        delete_set[newStr] = false

        //delete the original word key value pair
        delete dictionary_sameword[lastClicked]
        delete delete_set[lastClicked]

        //update the last clicked item
        lastClicked = newStr
    })

    replaceConfirm.addEventListener('mouseover', function() {
        replaceConfirm.style.animation = 'onbt 0.6s forwards'
    })

    replaceConfirm.addEventListener('mouseout', function() {
        replaceConfirm.style.animation = 'outbt 0.6s forwards'
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

    //replace window cancel button animations and style
    replaceClose.addEventListener('click', function() {
        replace_back.style.display = "none"
        replace_field.style.display = "none"
    })

    replaceClose.addEventListener('mouseOver', function() {
        replaceClose.style.animation = 'crson 0.6s forwards'
    })

    replaceClose.addEventListener('mouseout', function() {
        replaceClose.style.animation = 'crsout 0.6s forwards'
    })

/*************************************************************************/
//Categorize window
/*************************************************************************/
    //categorize button confirm button clicked
    categorizeConfirm.addEventListener('click', function() {
        //hide the categorize  window
        categorize_back.style.display = "none"
        categorize_field.style.display = "none"
        var newStr = categorizeTextField.value.toLowerCase().replace(/[^a-zA-Z ]/g, "")

        //modify the text for each origin node
        Array.prototype.forEach.call(dictionary_sameword[lastClicked], function(itemX, index) {
            itemX.innerHTML = categorizeTextField.value;                //get what the radio selection is and add to dict
            itemX.style.textDecoration = "none"
            itemX.style.opacity = "1"
        })
        menuItems[0].innerHTML = "Delete"
        //update the dictionary for the word
        dictionary_sameword[newStr] = dictionary_sameword[lastClicked]  //dict for the word; update this
        delete_set[newStr] = false

        //delete the original word key value pair
        delete dictionary_sameword[lastClicked]
        delete delete_set[lastClicked]

        //update the last clicked item
        lastClicked = newStr
    })

    categorizeConfirm.addEventListener('mouseover', function() {
        categorizeConfirm.style.animation = 'onbt 0.6s forwards'
    })

    categorizeConfirm.addEventListener('mouseout', function() {
        categorizeConfirm.style.animation = 'outbt 0.6s forwards'
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

    //categorize window cancel button animations and style
    categorizeClose.addEventListener('click', function() {
        categorize_back.style.display = "none"
        categorize_field.style.display = "none"
    })

    categorizeClose.addEventListener('mouseOver', function() {
        categorizeClose.style.animation = 'crson 0.6s forwards'
    })

    categorizeClose.addEventListener('mouseout', function() {
        categorizeClose.style.animation = 'crsout 0.6s forwards'
    })
/*************************************************************************/

    //add click listener to menu options.
    //*****call your function here for different tasks here*****
    Array.prototype.forEach.call(menuIcons, function(item) {

        item.addEventListener('click', function() {
            var menu = item.innerHTML.toLowerCase()
            // delete,find/replace,cate,asso
            if (menu == "delete" || menu == "undelete") {
                del()
            } else if (menu == "replace") {
                replace()
            } else if (menu == "categorize") {
                categorize()
            } else if (menu == "associate") {
                // function
            } else if (menu == "cancel") {
                // function
                cancelEdit()
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

    //detele function
    function del() {
        //delete
        if (delete_set[lastClicked] == false) {
            delete_set[lastClicked] = true
            menuItems[0].innerHTML = "Undelete"
            //cross words
            Array.prototype.forEach.call(dictionary_sameword[lastClicked], function(itemX, index) {
                itemX.style.textDecoration = "line-through"
                itemX.style.opacity = "0.4"
            })
        } else {
            //undelete
            delete_set[lastClicked] = false
            menuItems[0].innerHTML = "Delete"
            //uncross
            Array.prototype.forEach.call(dictionary_sameword[lastClicked], function(itemX, index) {
                itemX.style.textDecoration = "none"
                itemX.style.opacity = "1"
            })
        }
    }

    //replace function
    function replace() {
        replaceTextField.value = ""
        replace_back.style.display = "block"
        replace_field.style.display = "block"
    }

    //categorize function
    function categorize() {
        categorize_back.style.display = "block"
        categorize_field.style.display = "block"
    }

}
