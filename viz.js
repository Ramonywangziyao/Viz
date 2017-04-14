/*
  Authors : Ziyao Wang / Ritika Maknoor / Matthew Turley / Daniel Blackford
  Created : 2017 Feb

  Project : viz

*/

window.onload = function() {
    //declare variables

    //file upload button
    var fileInput = document.getElementById('upload')

    //where to replace innerHTML with doc contents
    var docText = document.getElementById('docText')
    var docback = document.getElementById('document')
    var returnTop = document.getElementById('returnTop')

    //wrappers
    var uploadBt = document.getElementById('upload-wrapper')
    var cancelBt = document.getElementById('cancel-button')

    var footer = document.getElementById('footer')

    //tool menu associates
    var tooMenu = document.getElementById('toolMenu')
    var menuSet = document.getElementById('toolSet')
    var exportButton = document.getElementById('exportButton')
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

    // categorize_dictinary[word] = category
    var categorize_dictinary = {}

    // name[category] = [word0, word1, ...]
    var categorized_word_dictinary = {}
    var categories_file

    //preprocess the doc text to create the hashtable.
    function preprocess(spanWords) {
        returnTop.innerHTML = "Return Top"
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
        // Load the persistent categorized_word_dictionary stored as a JSON
        // string in categories_file.txt, and then call updateHighlight()

    }

    function updateHighlight() {
        for (var key in categorized_word_dictinary) {
            var color = ''
            if (key == "categoryOne") {
                color = "#70437a"
            }
            if (key == "categoryTwo") {
                color = "#826e58"
            }
            if (key == "categoryThree") {
                color = "#7c8260"
            }
            if (key == "categoryFour") {
                color = "#4e777a"
            }
            if (key == "categoryFive") {
                color = "#7e4453"
            }
            Array.prototype.forEach.call(categorized_word_dictinary[key], function(ele, idx) {
                Array.prototype.forEach.call(dictionary_sameword[ele], function(word, i) {
                    word.style.background = color
                })
            })
        }
    }

    //add event listener for upload button.
    fileInput.addEventListener('change', function(e) {
        var file = fileInput.files[0]
        var textType = /text.*/
        exportButton.style.display = "inline"

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
                    menuItems[0].innerHTML = "Editing:\xa0\xa0" + str

                    docText.style.color = "#1f1f20"
                    Array.prototype.forEach.call(dictionary_sameword[str], function(itemX, index) {
                        itemX.style.color = "#ffffff"
                    })
                    clicked = true
                    lastClicked = str
                    tooMenu.style.display = "block"
                    tooMenu.style.animation = "menuShow 0.5s forwards"
                    menuSet.style.animation = "fadein 1.5s forwards"
                    cancelBt.style.display = "none"
                    //modify the menu delete for the clicked word
                    if (delete_set[lastClicked] == false) {
                        menuItems[1].innerHTML = "Delete"
                    } else {
                        menuItems[1].innerHTML = "Undelete"
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

    function cancelEdit() {
        Array.prototype.forEach.call(dictionary_sameword[lastClicked], function(itemX, index) {
            itemX.style.color = ""
        })
        docText.style.color = "#ffffff"
        clicked = false
        tooMenu.style.animation = "menuHide 0.5s forwards"
        menuSet.style.animation = "fadeout 0.2s forwards"
        onEditing = false
        tooMenu.style.display = "none"
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

    exportButton.addEventListener('click', function() {
        exportTo()
        categories_file = JSON.stringify(categorized_word_dictinary);
        exportJson()
    })

    //replace button confirm button clicked
    replaceConfirm.addEventListener('click', function() {
        //hide the replace  window
        replace_back.style.display = "none"
        replace_field.style.display = "none"
        var newStr = replaceTextField.value.toLowerCase().replace(/[^a-zA-Z ]/g, "")

        //modify the text for each origin node
        Array.prototype.forEach.call(dictionary_sameword[lastClicked], function(itemX, index) {
            var val = itemX.innerHTML.charAt(itemX.innerHTML.length - 1)
            //check for ending special characters
            itemX.innerHTML = val.match(/[^a-zA-Z ]/g) ? replaceTextField.value + val : replaceTextField.value
            itemX.style.textDecoration = "none"
            itemX.style.fontStyle = "italic"
            itemX.style.opacity = "1"
        })

        menuItems[1].innerHTML = "Delete"
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
        exportButton.style.display = "none"
    })

    cancelBt.addEventListener('mouseover', function() {
        cancelBt.style.animation = 'crson 0.6s forwards'
    })

    cancelBt.addEventListener('mouseout', function() {
        cancelBt.style.animation = 'crsout 0.6s forwards'
    })

    exportButton.addEventListener('mouseover', function() {
        exportButton.style.animation = 'crson 0.6s forwards'
    })

    exportButton.addEventListener('mouseout', function() {
        exportButton.style.animation = 'crsout 0.6s forwards'
    })

    returnTop.addEventListener('mouseover', function() {
        returnTop.style.animation = 'crson 0.6s forwards'
    })

    returnTop.addEventListener('mouseout', function() {
        returnTop.style.animation = 'crsout 0.6s forwards'
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
        var my_category
        // Store the word that was clicked, without any extra text
        var new_string = lastClicked.toLowerCase().replace(/[^a-zA-Z ]/g, "")
        //hide the categorize  window
        categorize_back.style.display = "none"
        categorize_field.style.display = "none"

        //modify the text for each origin node
        Array.prototype.forEach.call(dictionary_sameword[lastClicked], function(itemX, index) {
            var my_categories = document.getElementsByName("categories")
            // For loop to get the selected element
            for (var i = 0, length = my_categories.length; i < length; i++) {
                if (my_categories[i].checked) {
                    my_category = my_categories[i].value
                }
            }

            itemX.style.textDecoration = "none"
            itemX.style.opacity = "1"
        })

        // Function that updates the category dictionaries
        update_categories(new_string, my_category)

        // If the word was deleted, will be "undeleted," this allows word to be "redeleted"
        menuItems[1].innerHTML = "Delete"
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
        fileInput.value = ""
        returnTop.innerHTML = "Main"
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
            menuItems[1].innerHTML = "Undelete"
            //cross words
            Array.prototype.forEach.call(dictionary_sameword[lastClicked], function(itemX, index) {
                itemX.style.textDecoration = "line-through"
                itemX.style.opacity = "0.4"
            })
        } else {
            //undelete
            delete_set[lastClicked] = false
            menuItems[1].innerHTML = "Delete"
            //uncross
            Array.prototype.forEach.call(dictionary_sameword[lastClicked], function(itemX, index) {
                itemX.style.textDecoration = "none"
                itemX.style.opacity = "1"
            })
        }
    }

    // Function to update categorized_word_dictinary when a word is assigned a category, or it's category is updates
    // Also updates categorize_dictinary[word] to have the new category
    function update_categories(word, category) {
        var my_class
        // Get the current category of the word
        if (typeof categorize_dictinary[word] != 'undefined') {
            my_class = categorize_dictinary[word]
        }

        // If the word has a current category, remove it
        if (typeof my_class != 'undefined') {
            var index = categorized_word_dictinary[my_class].indexOf(word)
            if (index > -1) {
                categorized_word_dictinary[my_class].splice(index, 1)
            } else {
                // The word should be here, if it is not it was not added to this list as it was supposed to be
                alert("An Error Has Occured!")
            }
        }

        // Check if current category is in categorized_word_dictinary
        if (typeof categorized_word_dictinary[category] != 'undefined') {
            // The category already exist, just add it the the array
            categorized_word_dictinary[category].push(word)
        } else {
            // The category does not currently exist, create and array and put it in its place
            var new_class = [word]
            categorized_word_dictinary[category] = new_class
        }

        // Update categorize_dictinary with the new key pair
        categorize_dictinary[word] = category
        updateHighlight()
    }

    //replace function
    function replace() {
        replaceTextField.value = ""
        replace_back.style.display = "block"
        replace_field.style.display = "block"
    }

    //categorize function
    function categorize() {
        // The stripped down string, for finding the radio to select
        var new_string = lastClicked.toLowerCase().replace(/[^a-zA-Z ]/g, "")
        var my_class
        // Setting the class, if the class is not in the dictinary it  will defualt to the first clas
        if (typeof categorize_dictinary[new_string] != 'undefined') {
            my_class = categorize_dictinary[new_string]
        } else {
            my_class = "categoryOne"
        }
        // Select the radio button for the current class
        document.getElementById(my_class).checked = true

        // Display the window
        categorize_back.style.display = "block"
        categorize_field.style.display = "block"
    }

    function exportTo() {
        // this is for plain text of the original doc
        // output text. Add a new one for json
        var text = docText.innerHTML.replace(/<\/?span[^>]*>/g, "");
        var filename = "outputdoc"
        //use blob. can diy text format
        var blob = new Blob([text], {
            type: "text/plain;charset=utf-8"
        });
        saveAs(blob, filename + ".txt");
    }

    function exportJson() {
        var filename = "json_output";
        var blob = new Blob([categories_file], {
            type: "text/plain;charset=utf-8"
        });
        saveAs(blob, filename + ".txt");
    }
}
