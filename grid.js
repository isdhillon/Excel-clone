//Declarations
let leftCol=document.querySelector(".left_col");
let topRow=document.querySelector(".top_row");
let grid=document.querySelector(".grid");
let addressInput = document.querySelector(".address-input");
let boldbtn=document.querySelector(".bold");
let underlinebtn=document.querySelector(".underline");
let italicbtn=document.querySelector(".italic");
let alignbtn=document.querySelectorAll(".align-container>*");
let leftbtn=document.querySelector(".left");
let rightbtn=document.querySelector(".right");
let centerbtn=document.querySelector(".center");
let colorbtn=document.querySelector(".color");
let bgcolorbtn=document.querySelector(".bg-color");
let fontSizeList=document.querySelector(".font-size");
let fontFamily=document.querySelector(".font-family");
let borderStyle=document.querySelector(".border-style");
let formulaBar=document.querySelector(".formula-input");
let btnContainer=document.querySelector(".add-sheet_btn-container");
//container of the sheets
let sheetList=document.querySelector(".sheet-list")
//the first sheet which is present at the starting
let firstSheet=document.querySelector(".sheet");
let crossbtn=document.querySelector(".cross");
let rows=100;
let cols=26;
//sheet database collecting array
let sheetArray=[];
//database of the selected sheet
let sheetDb;

//left coloumn creation
for(let i=0;i<rows;i++){
    //creating the row boxes
    let colBox=document.createElement("div");
    colBox.innerHTML=i+1;
    colBox.setAttribute("class","box");
    leftCol.appendChild(colBox);
}
//top row creation
for(let i=0;i<cols;i++){
    //making the topmost cells
    let cell=document.createElement("div");
    cell.innerHTML=String.fromCharCode(65+i);
    cell.setAttribute("class","cell");
    topRow.appendChild(cell);

}
//grid creation
for(let i=0;i<rows;i++){
    //creating row
    let row=document.createElement("div");
    row.setAttribute("class","row");
    for(let j=0;j<cols;j++){
        //creating cell
        let cell=document.createElement("div");
        cell.setAttribute("class","cell");
        cell.setAttribute("rid",i);
        cell.setAttribute("cid",j);
        cell.setAttribute("contenteditable","true");
        row.appendChild(cell);
    }
    //appending row to grid
    grid.appendChild(row);
}
//clicking on the first sheet to make the grid and rows
firstSheet.addEventListener("click",makeMeActive);
//clicking on the first sheet
firstSheet.click();

//plus button to add a new sheet
btnContainer.addEventListener("click",function(){
    //declarations
    let AllSheets=document.querySelectorAll(".sheet");
    //getting the latest sheet
    let LastSheet=AllSheets[AllSheets.length-1];
    //getting the last index
    let LastIdx=LastSheet.getAttribute("idx");
    //conversion it to number
    LastIdx=Number(LastIdx);
    //new element created
    let NewSheet=document.createElement('div'); 
    NewSheet.setAttribute("class","sheet");
    NewSheet.setAttribute("idx",`${LastIdx+1}`);
    //adding inner text sheet no
    NewSheet.innerText=`Sheet ${LastIdx+2}`;
    //child appended to the sheet list array
    sheetList.appendChild(NewSheet);
    //removing active classes from all the elements
    for(let i=0;i<AllSheets.length;i++){
        AllSheets[i].classList.remove("active");
    }
    //adding class to only the specified one
    NewSheet.classList.add("active");
    //creating news sheet
    createSheet();
    //getting the database of the sheet
    sheetDb=sheetArray[LastIdx+1];
    //making the sheet active
    NewSheet.addEventListener("click",makeMeActive)
    
})
function makeMeActive(e){
    //selecting the sheet
    let sheet=e.currentTarget;
    let AllSheets=document.querySelectorAll(".sheet");
    for(let i=0;i<AllSheets.length;i++){
        AllSheets[i].classList.remove("active");
    }
    //adding active class
    sheet.classList.add("active");
    let idx=sheet.getAttribute("idx");
    //if sheet does not exist make sheet
    if(!sheetArray[idx]){
        createSheet();
    }
    //assign database to sheet
    sheetDb=sheetArray[idx];
    //setup ui
    setUi();
}
//@2D array creation
function createSheet(){
    //creating new database for sheet (2d matrix)
    let NewDB=[];
    //making rows
    for(let i=0;i<rows;i++){
        let row=[];
        for(let j=0;j<cols;j++){
            //making cell objects
            let cell={
                //default values
                bold:"normal",
                italic:"normal",
                underline:"none",
                hAlign:"center",
                fontFamily:"sans-serif",
                fontSize:"16",
                border:"solid",
                color:"black",
                bgcolor:"black",
                value:"",
                formula:"",
                children: []
            };
            //reseting the cels text
            let ele=document.querySelector(`.grid .cell[rid="${i}"][cid="${j}"]`);
            ele.innerText="";
            row.push(cell);
        }
        
        NewDB.push(row);
    }
    //pushing database in the sheet array
    sheetArray.push(NewDB);
}
function setUi(){
    //filling the cells with data if any
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
            let ele=document.querySelector(` .grid .cell[rid="${i}"][cid="${j}"]`);
            let value=sheetDb[i][j].value;
            ele.innerText=value;
            }
        }
}
//the changes are shown on the menu bar menu bar UI
let allCells=document.querySelectorAll(".grid .cell");
for(let i=0;i<allCells.length;i++){
    //adding event lister to the cell
    allCells[i].addEventListener("click",function(){
        let rid=allCells[i].getAttribute("rid");
        let cid=allCells[i].getAttribute("cid");
        rid=Number(rid);
        cid=Number(cid);
        //getting cell address  
        let address = `${String.fromCharCode(65 + cid)}${rid + 1}`;
        //displaying the address on address bar 
        addressInput.value=address;
        //selecting the cell object
        let cellObject=sheetDb[rid][cid];
        //Bold
        if(cellObject.bold=="normal"){
            boldbtn.classList.remove("active-class");
        }
        else{
            boldbtn.classList.add("active-class");
        }
        //Unerline
        if(cellObject.underline=="none"){
            underlinebtn.classList.remove("active-class");
        }
        else{
            underlinebtn.classList.add("active-class");
        }
        //Italic
        if(cellObject.italic=="normal"){
            italicbtn.classList.remove("active-class");
        }
        else{
            italicbtn.classList.add("active-class");
        }
        //Align buttons
        for(let i=0;i<alignbtn.length;i++){
            alignbtn[i].classList.remove("active-class");
        }
        if(cellObject.hAlign=="left"){
            leftbtn.classList.add("active-class");
        }
        else {
            if(cellObject.hAlign=="right"){
                rightbtn.classList.add("active-class");
            }
            else{
                centerbtn.classList.add("active-class");
            }
        }
        //font size
        if(cellObject.fontSize=="12"){
            fontSizeList.value="12";
        }
        else {
            if(cellObject.fontSize=="16"){
                fontSizeList.value="16";
            }
            else{
                if(cellObject.fontSize=="20"){
                    fontSizeList.value="20";
                }
                else{
                    fontSizeList.value="32";
                }
            } 
        } 

        //Font Family
        if(cellObject.fontFamily=="monospace"){
            fontFamily.value="monospace";
        }
        else  {
            if(cellObject.fontFamily=="sans-serif"){
                fontFamily.value="sans-serif";
            }
            else {
                if(cellObject.fontFamily=="Georgia"){
                    fontFamily.value="Georgia";
                }
                else{
                    fontFamily.value="fantasy";
                }
            }    
        }

        //cell borders
        if(cellObject.border=="none"){
            borderStyle.value="none";
        }
        else {
            if(cellObject.border=="dotted"){
                borderStyle.value="dotted";
            }
            else {
                if(cellObject.border=="dashed"){
                    borderStyle.value="dashed";
                }
                else{
                    borderStyle.value="solid";
                }
            }
        }

        //Text-color
        if(cellObject.color!="black"){
            colorbtn.value=cellObject.color;
        }
        else{
            colorbtn.value="#000000";
        }

        //Background color
        if(cellObject.bgcolor!="black"){
            bgcolorbtn.value=cellObject.bgcolor;
        }
        else{
            bgcolorbtn.value="#000000";
        }

        //Formula bar
        if(cellObject.formula){
            formulaBar.value=cellObject.formula;
        }
        else{
            formulaBar.value="";
        }


    })


}

//Event listeners
//bold
boldbtn.addEventListener("click",function(){
let uiCellElement=findUICellElement();
let cid=uiCellElement.getAttribute("cid");
let rid=uiCellElement.getAttribute("rid");
let cellObject=sheetDb[rid][cid];
//checking on the object
if(cellObject.bold=="normal"){
    //updating on the cell
    uiCellElement.style.fontWeight="bold";
    //adding on the menu button
    boldbtn.classList.add("active-class");
    //updating it back on the object
    cellObject.bold="bold";
}
else{
    uiCellElement.style.fontWeight="normal";
    boldbtn.classList.remove("active-class");
    cellObject.bold="normal";
}
})
//underline
underlinebtn.addEventListener("click",function(){
let uiCellElement=findUICellElement();
let cid=uiCellElement.getAttribute("cid");
let rid=uiCellElement.getAttribute("rid");
let cellObject=sheetDb[rid][cid];
    if(cellObject.underline=="none"){
    uiCellElement.style.textDecoration="underline";
    underlinebtn.classList.add("active-class");
    cellObject.underline="underline";
}
    else{
        uiCellElement.style.textDecoration="none";
        underlinebtn.classList.remove("active-class");
        cellObject.underline="none";
    }
})
//italic
italicbtn.addEventListener("click",function(){
    uiCellElement=findUICellElement();
    let cid=uiCellElement.getAttribute("cid");
    let rid=uiCellElement.getAttribute("rid");
    let cellObject=sheetDb[rid][cid];
    if(cellObject.italic=="normal"){
    uiCellElement.style.fontStyle="italic";
    italicbtn.classList.add("active-class");
    cellObject.italic="italic";
    }
    else{
        uiCellElement.style.fontStyle="normal";
        italicbtn.classList.remove("active-class");
        cellObject.italic="normal";
    }
})
//alignment
for(let i=0;i<alignbtn.length;i++){
    alignbtn[i].addEventListener("click",function(){
        //getting alignment from the button clicked
        let alignment=alignbtn[i].getAttribute("class").split(" ").slice(-1);
        let uiCellElement=findUICellElement();
        let cid=uiCellElement.getAttribute("cid");
        let rid=uiCellElement.getAttribute("rid");
        let cellObject=sheetDb[rid][cid];
        //removing the class from all the buttons
        for(let j=0;j<alignbtn.length;j++){
            alignbtn[j].classList.remove("active-class");
        }
        //adding active class to the selected button
        if(alignment=="left"){
            leftbtn.classList.add("active-class");
        }
        else {
            if(alignment=="right"){
                rightbtn.classList.add("active-class");
                }
            else{
                centerbtn.classList.add("active-class");
            }
        }
        //updating it on the cell
        uiCellElement.style.textAlign = alignment;
        //updating it on the object
        cellObject.hAlign=alignment;
    })
}
//text color
colorbtn.addEventListener("change",function(e){
    let uiCellElement=findUICellElement();
    let cid=uiCellElement.getAttribute("cid");
    let rid=uiCellElement.getAttribute("rid");
    let cellObject=sheetDb[rid][cid];
    //updating it to the cell
    uiCellElement.style.color=e.target.value;
    //updating the changes on the object
    cellObject.color=e.target.value;
})
//background color
bgcolorbtn.addEventListener("change",function(e){
    let uiCellElement=findUICellElement();
    let cid=uiCellElement.getAttribute("cid");
    let rid=uiCellElement.getAttribute("rid");
    let cellObject=sheetDb[rid][cid];
    cellObject.bgcolor=e.target.value;     
    uiCellElement.style.backgroundColor=e.target.value;
})
//font size change
fontSizeList.addEventListener("change",function(){
    //getting the value selected on the drop down menu
    let size=fontSizeList.value;
    let uiCellElement=findUICellElement();
    let cid=uiCellElement.getAttribute("cid");
    let rid=uiCellElement.getAttribute("rid");
    let cellObject=sheetDb[rid][cid];
    //updating it on the cell
    uiCellElement.style.fontSize=size+"px";
    //upadting it on the object
    cellObject.fontSize=size;
    
})
//font family function
fontFamily.addEventListener("change",function(){
    let font=fontFamily.value;
    let uiCellElement=findUICellElement();
    let cid=uiCellElement.getAttribute("cid");
    let rid=uiCellElement.getAttribute("rid");
    let cellObject=sheetDb[rid][cid];
    cellObject.fontFamily=font;
    uiCellElement.style.fontFamily=font;
})
borderStyle.addEventListener("change",function(){
    let border=borderStyle.value;
    let uiCellElement=findUICellElement();
    let cid=uiCellElement.getAttribute("cid");
    let rid=uiCellElement.getAttribute("rid");
    let cellObject=sheetDb[rid][cid];
    cellObject.border=border;
    uiCellElement.style.borderStyle=border;
})

//clearing all the formating on the cell
crossbtn.addEventListener("click",function(){
    let uiCellElement=findUICellElement();
    let cid=uiCellElement.getAttribute("cid");
    let rid=uiCellElement.getAttribute("rid");
    let cellObject=sheetDb[rid][cid];
    //updating the changes to object
    cellObject.bold="normal";
    //updating the changes to the cell
    uiCellElement.style.fontWeight="normal";
    cellObject.italic="normal";
    uiCellElement.style.fontStyle="normal"
    cellObject.underline="none";
    uiCellElement.style.textDecoration="none";
    cellObject.hAlign="center";
    uiCellElement.style.textAlign ="center";
    cellObject.fontFamily="sans-serif";
    uiCellElement.style.fontFamily="sans-serif";
    cellObject.fontSize="16";
    uiCellElement.style.fontSize="16px";
    cellObject.border="solid";
    uiCellElement.style.borderStyle="solid";
    cellObject.color="black";
    uiCellElement.style.color="black";
    cellObject.bgcolor="black";
    uiCellElement.style.backgroundColor="#f1f2f6";
    cellObject.value="";
    uiCellElement.innerText="";
})
//functions

//to get address of the cell
function getRICIDfromaddress(address){
    //getting cid by converting A to char code and converting it back to number and subtracting (Ascii value of A)
        let cid=Number(address.charCodeAt(0))-65;
    //getting the rid and subtracting one bcz it starts with 0
        let rid=Number(address.slice(1))-1;
        //returning the object with cid and rid
    return {"rid":rid,"cid":cid}
}
//finding element
function findUICellElement(){
    //getting address from address baar
let address=addressInput.value;
let ricidObj=getRICIDfromaddress(address);
//getting cid and rid from the object returned
let rid=ricidObj.rid;
let cid=ricidObj.cid;
//selecting the element
let uiCellElement=document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
//returning the cell
return uiCellElement;
}
//selecting the first cell by default
allCells[0].click();
//adding toogle property to change the css style sheet
let toggle=document.querySelector(".toggle");
let cssSheet=document.querySelector(".cssSheet")
let clicked=true;
toggle.addEventListener("click",function(){
    if(clicked==true){
        //changing the icon
        toggle.innerText="toggle_off"
        //updating style sheet
        cssSheet.setAttribute("href","darkstyle.css")
        clicked=false;
    }
    else{
        toggle.innerText="toggle_on"
        cssSheet.setAttribute("href","style.css")
        clicked=true;
    }
})
