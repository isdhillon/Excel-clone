//Declarations
let saveBtn = document.querySelector(".save");
let openBtn = document.querySelector(".open");
let newBtn = document.querySelector(".new");
let overlay=document.querySelector(".overlay")
let openFile=document.querySelector(".open-file")
let fileName=document.querySelector(".file-name");
//download file
saveBtn.addEventListener("click", function () {
    //converting the sheet array to json file
    const data = JSON.stringify(sheetArray);
    // json file is converted to blob object 
    const blob = new Blob([data], { type: 'application/json' });
    // blob object converted into url
    const url = window.URL.createObjectURL(blob);
    //creating an anchor tag
    let a = document.createElement("a");
    // assigning url to href property of anchor
    a.href = url;
    // file download
    a.download = `${fileName.value}.json`;
// click on anchor so that the file is downloaded
    a.click();
})


//open file json file 
//when open button is clicked
openBtn.addEventListener("click",function(){
    overlay.style.display="block";
})
//A container appears on clicking open button
openFile.addEventListener("change", function () {
    //getting the array of the uploaded files
    let filesArray = openFile.files;
    //getting the object from the frist uploaded file
    let fileObj = filesArray[0];
    // file reader
    let fr = new FileReader();
    // reading the file as text 
    fr.readAsText(fileObj);
    //assigning the file name to the menu
    fileName.value=fileObj.name.split(".")[0]
    //when the file is loaded
    fr.addEventListener("load", function () {
        //json file is converted back to sheet array
        sheetArray=JSON.parse(fr.result);
        //getting the database from the array
        sheetDb=sheetArray[0]
        //setting the ui
        setUi();
        //hiding back the open file menu
        overlay.style.display="none"
    })
//new file
})
newBtn.addEventListener("click",function(){
    //reloading the page
    location.reload();

})
