<h1>Specification</h1>
<br/>
<h2>Task SignUp</h2>
<ul>
<li>Document Processing - </li>
<li>Del - Ziyao Wang</li>
<li>Find / Replace - Ziyao Wang</li>
<li>Categorization - </li>
<li>Association - </li>
</ul>
<br/>
<h2>Task Description</h2>
<h3>***ALL CODE FOR DIFFERENT TASKS SHOULD BE IN JAVASCRIPT, AND UPLOADED WITHIN FUNCTIONS***</h3>
<h3>***ALL CODE SHOULD BE TESTED SEPARATELY WITH A DOCUMENT TO WORK BEFORE FINAL SUBMISSION***</h3>
<h3>***IT IS SUGGESTED TO CREATE SEPARATE BRANCHES AND MERGE WHEN YOU ARE CONFIDENT WITH THE CODE TO WORK!***</h3>

<h3>Document Processing</h3>
<p><b>Goal:</b> This task focuses on categorizing the original document into different class.</p>
<p><b>Input:</b>A document in .txt file.</p>
<p><b>Output:</b>A list of classes, each class containing its word</p>
<h4>What to upload</h4>
<p>var class_lis=function doc_process(document).document is a txt document. class_lis can be list variables containing list of words, or can output a JSON file</p>
<p>function highlight(class_lis). The input class_lis is the output above or can read in a JSON file to process, highlight different class with different color in DOM.(Simply write code to process the DOM and change color of words.)</p>
<br/>
<h3>Del</h3>
<p><b>Goal:</b> This task focuses on cross the words user asks to delete.</p>
<p><b>Input:</b>No. Its a action listener function when user clicks DEL.</p>
<p><b>Output:</b>No. Only modifies the DOM Nodes.</p>
<h4>What to upload</h4>
<p>function del(). It modifies the dom and cross the word user selected.</p>
<br/>
<h3>Find / Replace</h3>
<p><b>Goal:</b> This task focuses on implementing the find and replace function of the doc.</p>
<p><b>Input:</b>A string in a textfield asks user to type what to replace with.</p>
<p><b>Output:</b>No. Only modifies the DOM Nodes.</p>
<h4>What to upload</h4>
<p>function find_replace(new_val). It modifies the dom and replace the word with new_val.</p>
<br/>
<h3>Categorization</h3>
<p><b>Goal:</b> This task focuses on matching user selected word with the class user select. We have a hard coded list of classes we have. It will show a drop box to ask user select a class for this selected word.</p>
<p><b>Input:</b>A string/word user selected. A class user selectd.</p>
<p><b>Output:</b>No. Only modifies the DOM Nodes.</p>
<h4>What to upload</h4>
<p>function categorize(word,class). It modifies the dom and change all the same word to match the new class.</p>
<br/>
<h3>Association</h3>
<p><b>Goal:</b>This task asks user to associate a word with generic types. The specific requirement will be disscussed later.</p>
<p><b>Input:</b>A string/word user selected. Pre-defined word or user typed word he/she wants this word to associate with.</p>
<p><b>Output:</b>No. Only modifies the DOM Nodes.</p>
<h4>What to upload</h4>
<p>function associate(word,type). It modifies the dom and change all the same word to associate with the new word.</p>




