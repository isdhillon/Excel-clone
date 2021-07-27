//three cases
// setting the value of cell object when another cell selected
for(let i=0;i<allCells.length;i++){
    // adding blur event listener on the cell which is selected so that the detalis are saved when we leave the cell
    allCells[i].addEventListener("blur",function(){
        //fetching the value from the cell
        let data=allCells[i].innerText;
        //address from the address input
        let address = addressInput.value;
        //getting row id and column id of the valued cell
        let rid=allCells[i].getAttribute("rid");
        let cid=allCells[i]. getAttribute("cid");
     // geting the cellobject using rows and columns
        let cellObject=sheetDb[rid][cid];
        // if no changes on the data return
        if(cellObject.value==data){
            return;
        }
        if(cellObject.formula){
            //removing the formula and removing the element from parent obj
            removeFormula(cellObject,address);
            //updating formulabar
            formulaBar.value="";
        }
        // updating the value
        //new value is updated from the formula
        //new value is set to the object
        //and same is done for the childen of cellobject
        updateChildren(cellObject);
    })
}
//formulabar
formulaBar.addEventListener("keydown",function(e){
    // adding event listener on the bar
    if(e.key=="Enter" && formulaBar.value){
        // getting the current formula value
        let currentFormula=formulaBar.value;
        // getting adress from address bar of the targeted cell
        let address=addressInput.value;
        //getting the object from address
        let { rid,cid}=getRICIDfromaddress(address);
        let childObj=sheetDb[rid][cid];
        //if the formula is changed remove the formula
        if(currentFormula!=childObj.formula){
            //remove formula from the childobj
            removeFormula(childObj,address);
        }
        //getting the result from evalute formula in the value
        let value=evaluateFormula(currentFormula);
        //storing the value n formula in sheet
        SetCell(value,currentFormula);
        //updating the chldren aaray in the object
        setParentCHArray(currentFormula,address);
        //new value is updated from the formula
        //new value is set to the object
        //and same is done for the childen of cellobject
        updateChildren(childObj);
    }
})
//functions
// evaluting the value from formula bar
function evaluateFormula(formula){
    //the array is split using spaces
    let FormulaTokkens=formula.split(" ");
    //loop
    for(let i=0;i<FormulaTokkens.length;i++){
        //geetng ascii values
        let ascii=FormulaTokkens[i].charCodeAt(0);
        // A to Z only fulfill the condition
        if(ascii>=65 && ascii<=90){
            //getting the address of the cell which we got from above
            let {rid,cid}=getRICIDfromaddress(FormulaTokkens[i]);
            // geeting value from the sheet of the specified address
            let value=sheetDb[rid][cid].value;
            //replacing value instead of symbol eg A1
            FormulaTokkens[i]=value;
        }
    }
    // joining the tooken
    let evaluatedFormula=FormulaTokkens.join(" ");
    // getting the result from infix evaluation
    return infixEvaluation(evaluatedFormula);
}
function SetCell(value,formula){
    // getting the cell
    let uiCellElement=findUICellElement();
    // getting value
    uiCellElement.innerText=value;
    let {rid,cid}=getRICIDfromaddress(addressInput.value);
    //updating the sheet
    sheetDb[rid][cid].value=value;
    sheetDb[rid][cid].formula=formula;
}
//to get address of the cell
function getRICIDfromaddress(address){
    // column adrres
    let cid=Number(address.charCodeAt(0))-65;
    //row address
    let rid=Number(address.slice(1))-1;
    return {"rid":rid,"cid":cid}
}
//finding element
function findUICellElement(){
    //address bar value
let address=addressInput.value;
// geeting cid and rid
let ricidObj=getRICIDfromaddress(address);
let rid=ricidObj.rid;
let cid=ricidObj.cid;
let uiCellElement=document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
return uiCellElement;
}
// updating array
function setParentCHArray(formula,chAddress){
    //formula split
    let FormulaTokkens=formula.split(" ");
    let flag=true;
    //loop
    for(let i=0;i<FormulaTokkens.length;i++){
        //getting ascii value
        let ascii=FormulaTokkens[i].charCodeAt(0);
        //only if the condition is fulfilled
        if(ascii>=65 && ascii <90){
            let {rid,cid}=getRICIDfromaddress(FormulaTokkens[i]);
            let ParentObj=sheetDb[rid][cid];
            //checking for cycle
            if(isSafe(FormulaTokkens[i],chAddress)){

                ParentObj.children.push(chAddress);
            }
            //if cycle is detected
            else{
                alert("cycle formed")
                falg=flag && false;
            }
        }
    }
    return flag;
}
//changing value acc to parent
function updateChildren(cellObject){
    //geeting the children
    let children=cellObject.children;
    //loop
    for(let i=0;i<children.length;i++){
        //adress of children
        let chAddress=children[i];
        //gting the column
        let { rid,cid}=getRICIDfromaddress(chAddress);
        let childObj=sheetDb[rid][cid];
        //getting the formula
        let chFormula=childObj.formula;
        //calculating new value
        let newValue=evaluateFormula(chFormula);
        //updating the sheet with new value
        SetChildrenCell(newValue,chFormula,rid,cid);
        //updating the children object recursively
        updateChildren(childObj);
    }
}
//new value updation
function SetChildrenCell(value,formula,rid,cid){
    //selecting cell
    let uiCellElement=document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    uiCellElement.innerText=value;
    //updating sheet
    sheetDb[rid][cid].value=value;
    sheetDb[rid][cid].formula=formula;
}
//removing formula dependicies
function removeFormula(cellObject,myName){
    //getting formula
    let formula=cellObject.formula;
    // tokkens
    let FormulaTokkens=formula.split(" ");
    //loop
    for(let i=0;i<FormulaTokkens.length;i++){
        // ascii values
        let ascii=FormulaTokkens[i].charCodeAt(0);
        //filtering 
        if(ascii>=65 && ascii<=90){
            let { cid,rid }=getRICIDfromaddress(FormulaTokkens[i]);
            let ParentObj=sheetDb[rid][cid];
            // findiomg the index of current element
            let idx=ParentObj.children.indexOf(myName);
            // removing element
            ParentObj.children.splice(idx,1);
            //updating the sheet
            cellObject.formula="";
        }
    }
}
// to check cycle formation
function cycle(address,chAddress){
    //if address are same base case
    if(address==chAddress){
        return false;
    }
    //getting the children from the children address
    let {rid,cid}=getRICIDfromaddress(chAddress);
    let obj=sheetDb[rid][cid];
    let children=obj.children;
    let res=true;
    //if chidren is children of itself
    for(let i=0;i<children.length;i++){
        res=cycle(address,children[i]) && res
    }
    return res;
}
//to check if the cycle is formed
function isSafe(ParentObj,chAddress){
    let res=cycle(ParentObj,chAddress);
    return res;
}
//infix evaluation code is here
function infixEvaluation(exp){
    // operator stack
    let ostack = []
    // value stack 
    let vstack = []; 
    //splitting
    exp=exp.split(" ");
    for(let i = 0; i < exp.length; i++) {
        let ch = exp[i];
        if(ch=='+'|| ch=='-'||ch=='*'||ch=='/') {
            while(ostack.length > 0 && ostack[ostack.length-1] != '(' && 
                        priority(ostack[ostack.length-1] ) >= priority(ch)) {
                // process
                let op = ostack.pop();
                let val2 = vstack.pop();
                let val1 = vstack.pop();

                let res = evaluate(val1, val2, op);
                vstack.push((res));
            }
            ostack.push(ch);
        } else if(ch == '(') {
            ostack.push(ch);
        } else if(ch == ')') {
            while(ostack[ostack.length-1]  != '(') {
                let op = ostack.pop();
                let val2 = vstack.pop();
                let val1 = vstack.pop();
                let res = evaluate(val1, val2, op);
                vstack.push((res));
            }
            // this pop is for opening bracket
            ostack.pop(); 
        } else {
            vstack.push((ch));
        }
    }
    while(ostack.length > 0) {
        let op = ostack.pop();
        let val2 = vstack.pop();
        let val1 = vstack.pop();

        let res = evaluate(val1, val2, op);
        vstack.push((res));
    }
    return (vstack[vstack.length-1]) ;

}
function priority(op){
    if(op=="*" || op=="/"){
        return 2
    }
    else{
        if(op=="+"|| op=="-"){
            return 1
        }
        else{
            return 0
        }
    }
}
function evaluate(val1,val2,op){
    if(!isNaN(val1))
    val1=Number(val1);
    if(!isNaN(val2))
    val2=Number(val2);
    if(op == '*') {
        return val1 * val2;
    } else if(op == '/') {
        return val1 / val2;
    } else if(op == '+') {
        if(isNaN(val1)){
            return `${val1}${val2}`;
        }
        return val1 + val2;
    } else if(op == '-') {
        return val1 - val2;
    } else {
        return 0;
    }
}