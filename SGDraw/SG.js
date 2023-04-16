//*****************************************************************
//show images
//*****************************************************************

var jq=jQuery.noConflict();
var countI = 0;
var countJ=0;
var dir = "images/";
var fileextension = ".jpg";
var pathNames = [];
jq.ajax({
    //This will retrieve the contents of the folder if the folder is configured as 'browsable'
    url: dir,
    success: function (data) {
        //Lsit all png file names in the page
        //console.log(data);
        jq(data).find("a:contains(" + fileextension + ")").each(function () {
            var filename = this.href.replace(window.location.pathname, "").replace("http://", "");
            var pathName = filename.substring(filename.lastIndexOf('/') + 1); 
            pathNames[countI] = pathName;
            countI++;
        });
        console.log(pathNames);             
        jq("#showimages").append(jq("<img style= height:70%; id=img; src=" + dir + pathNames[0] +  "></img>"));
        console.log(countI);
    }
});
function previous(){
    if(countJ==0){
    alert("No previous image.");
    }  
    else{
    var img = document.getElementsByTagName("img")[0];
    img.setAttribute("src",dir+pathNames[countJ-1]);
    countJ=countJ-1;
    }
}
function next(){
if(countJ == countI-1){
    alert("No next image.");
}
else{
    var img = document.getElementsByTagName("img")[0];
    img.setAttribute("src",dir+pathNames[countJ+1]);
    countJ++;
}
}
jq("#list").change(function(){
    var opt=jq("#list").val();
    console.log(opt);
    var selnode = diagram.selection.first();
	if (!(selnode instanceof go.Node)) return;
    var content = sessionStorage.getItem(opt);
    var text = content;
    //console.log(text);
    var nodeB = text.indexOf("nodeDataArray");
    var nodeS = text.indexOf("],");
    var linkB = text.indexOf("linkDataArray");
    var linkS = text.indexOf("]}");
    var nodeStr = text.substring(nodeB+17,nodeS);
    var linkStr = text.substring(linkB+17,linkS);
    //console.log(nodeStr);
    //console.log(linkStr);
    var L1 = nodeStr.length;
    var L2 = linkStr.length;
    var keyStr;
    var colorStr;
    var FromStr;
    var ToStr;
    for(i=0;i<L1;i++){
        if(nodeStr[i]==":"){
            for(j=i;j<L1;j++){
                if(nodeStr[j]==",")
                {
                    keyStr = nodeStr.substring(i+2,j-1);
                    //console.log(keyStr);
                    break;
                }
                else if(nodeStr[j]=="}"){
                    colorStr = nodeStr.substring(i+2,j-1);
                   //console.log(colorStr);
                    var tem = { key: keyStr, color: colorStr};
                    diagram.model.addNodeData(tem);
                    break;
                }
            }
        }
    }

    for(count=0;count<L2;count++){
        if(linkStr[count]==":"){
            for(countL=count;countL<L2;countL++){
                if(linkStr[countL]==",")
                {
                    FromStr = linkStr.substring(count+2,countL-1);
                    //console.log(FromStr);
                    break;
                }
                else if(linkStr[countL]=="}"){
                    ToStr = linkStr.substring(count+2,countL-1);
                    //console.log(ToStr);
                    var temp = { from: FromStr, to: ToStr};
                    diagram.model.addLinkData(temp);
                    break;
                }
            }
        }
    }
    rememberkey = selnode.data.key;
    console.log("yes");
    console.log(selnode.data.key);
    diagram.model.removeNodeData(selnode.data);
    var data = diagram.model.findNodeDataForKey(opt);
    // This will NOT change the color of the "Delta" Node
    if (data !== null) diagram.model.setDataProperty(data, "key", rememberkey);

}
)



//*****************************************************************
//function part 
//*****************************************************************

var markable =0;
var $$ = go.GraphObject.make;

diagram = $$(go.Diagram, "myDiagramDiv",{
    initialContentAlignment:  go.Spot.Center,
    "toolManager.mouseWheelBehavior":  go.ToolManager.WheelZoom,//通过鼠标滚轮放大或缩小画布 
    // moving and copying nodes also moves and copies their subtrees
    "commandHandler.copiesTree": true,  // for the copy command
    "commandHandler.copiesParentKey" :  true ,
    "commandHandler.deletesTree": true, // for the delete command
    "draggingTool.dragsTree": true,  // dragging for both move and copy
    "undoManager.isEnabled": true  
});


//define nodes template
diagram.nodeTemplate =
    $$(go.Node, "Horizontal",
    $$(go.Panel,"Auto",
        $$(go.Shape, "RoundedRectangle",
            { fill: "yellow" },
            new go.Binding("fill", "color")),
        $$(go.TextBlock,
            { margin: 5 ,
            editable:true,
            text:"Object" 
            },
            new go.Binding("text", "key").makeTwoWay()) ,
    ),
    $$("TreeExpanderButton")
);

//*****************************************************************
//click the node and '<' button to open common attributes in right side
//click the node and '>' button to open common relationships in right side
//*****************************************************************

var partTem;
commonAttrAndRel = function(){
    diagram.addDiagramListener("ObjectSingleClicked",
    function(e) {
        console.log(e);
        var part = e.subject.part;
        partTem = e.subject.part;
        var markable1 = 0;
        if(part.data.color == "#ec8c69"){
            console.log("click");
            console.log(part.data.key);
            document.onkeydown=function (event) {
                if(event.keyCode == 188)
                {
                        var color = { key: "Color", color:"gray"};
                        diagram.model.addNodeData(color);  // this makes sure the key is unique
                        var newlink1 = { from: part.data.key, to: color.key };
                        diagram.model.addLinkData(newlink1);
                        var emotion = { key: "Emotion", color:"gray"};
                        diagram.model.addNodeData(emotion);  // this makes sure the key is unique
                        var newlink2 = { from: part.data.key, to: emotion.key };
                        diagram.model.addLinkData(newlink2);
                        var appearance = { key: "Appearance", color:"gray"};
                        diagram.model.addNodeData(appearance);  // this makes sure the key is unique
                        var newlink3 = { from: part.data.key, to: appearance.key };
                        diagram.model.addLinkData(newlink3);
                        var motion = { key: "Motion", color:"gray"};
                        diagram.model.addNodeData(motion);  // this makes sure the key is unique
                        var newlink4 = { from: part.data.key, to: motion.key };
                        diagram.model.addLinkData(newlink4);

                        var t = document.getElementById('myPaletteDiv');//选取id为test的div元素
                        t.style.display = 'block';
                        var t = document.getElementById('myPaletteDiv2');//选取id为test的div元素
                        t.style.display = 'block';
                        var t = document.getElementById('myPaletteDiv3');//选取id为test的div元素
                        t.style.display = 'block';
                        var t = document.getElementById('myPaletteDiv4');//选取id为test的div元素
                        t.style.display = 'block';
                        
                        removeandhide(color,emotion,appearance,motion,newlink1,newlink2,newlink3,newlink4);
                }

                if( event.keyCode == 190)
                {
                    var rela = {key:"relationship",color:"yellow"};
                    diagram.model.addNodeData(rela);
                    var newlink5 = { from: part.data.key, to: rela.key };
                    diagram.model.addLinkData(newlink5);
                    var t = document.getElementById('myPaletteDiv5');//选取id为test的div元素
                    t.style.display = 'block';
                    hiderela(rela,newlink5);
                    //addcommonrela(part,rela,newlink5);
        
                }
            }
        }
    }
    );
}

commonAttrAndRel();
diagram.layout = $$(go.TreeLayout);
diagram.model.undoManager.isEnabled = true;

var $=function(id){
    return document.getElementById(id);
};



diagram.addDiagramListener("BackgroundContextClicked",
    function(e){
        addObj();
    }
);

//*****************************************************************
//right click to add a object node (red node)
//*****************************************************************

addObj = function(){
    diagram.commit(function(d) {
    diagram.startTransaction("Add Node");
    var newnode = {key: "Object", color:"#ec8c69"};
    d.model.addNodeData(newnode);
    diagram.commitTransaction("Add Node");
    }, "add node and link");
}

addAtt = function(){
    var selnode = diagram.selection.first();
	if (!(selnode instanceof go.Node)) return;
	diagram.commit(function(d) {
        diagram.startTransaction("Add Node");
		// have the Model add a new node data
		var newnode = { key: "Attribute", color:"lightblue"};
		d.model.addNodeData(newnode);  // this makes sure the key is unique
		// and then add a link data connecting the original node with the new one
		var newlink = { from: selnode.data.key, to: newnode.key };
		// add the new link to the model
		d.model.addLinkData(newlink);
        diagram.commitTransaction("Add Node");
	}, "add node and link");
};

addRel = function() {
	var selnode = diagram.selection.first();
	if (!(selnode instanceof go.Node)) return;
	diagram.commit(function(d) {
        diagram.startTransaction("Add Node");
		var newnode = { key: "relationship", color:"yellow"};
		d.model.addNodeData(newnode); 
		var newlink = { from: selnode.data.key, to: newnode.key };
		d.model.addLinkData(newlink);
        addAimObj(newnode);
        diagram.commitTransaction("Add Node");
	}, "add node and link");
};

addAimObj = function(newnode){
    diagram.commit(function(d) {
        diagram.startTransaction("Add Node");
		var newnode1 = { key: "AimObject", color:"#ec8c69"};
		d.model.addNodeData(newnode1); 
		var newlink1 = { from: newnode.key, to: newnode1.key };
		d.model.addLinkData(newlink1);
        diagram.commitTransaction("Add Node");
	}, "add node and link");
}

//*****************************************************************
//add attributes and relationships from common part in the right side
//*****************************************************************

AddAttFromButton = function(value){
    var selnode = diagram.selection.first();
	if (!(selnode instanceof go.Node)) return;
	diagram.commit(function(d) {
        diagram.startTransaction("Add Node");
		// have the Model add a new node data
		var newnode = { key: value, color:"lightblue"};
		d.model.addNodeData(newnode);  // this makes sure the key is unique
		// and then add a link data connecting the original node with the new one
		var newlink = { from: selnode.data.key, to: newnode.key };
		// add the new link to the model
		d.model.addLinkData(newlink);
        diagram.commitTransaction("Add Node");
	}, "add node and link");
};

AddRelFromButton = function(value){
    var selnode = diagram.selection.first();
	if (!(selnode instanceof go.Node)) return;
	diagram.commit(function(d) {
        diagram.startTransaction("Add Node");
		var newnode = { key: value, color:"yellow"};
		d.model.addNodeData(newnode); 
		var newlink = { from: selnode.data.key, to: newnode.key };
		d.model.addLinkData(newlink);
        addAimObj(newnode);
        diagram.commitTransaction("Add Node");
	}, "add node and link");
};

//*****************************************************************
//give the scene graph a automatically tree layout
//*****************************************************************

function layoutTree(node) {
    if (node.data.key === 0) {  // adding to the root?
      layoutAll();  // lay out everything
    } else {  // otherwise lay out only the subtree starting at this parent node
      var parts = node.findTreeParts();
      layoutAngle(parts, node.data.dir === "left" ? 180 : 0);
    }
  }

diagram.addDiagramListener("Modified", e => {
    var button = document.getElementById("SaveButton");
    if (button) button.disabled = !diagram.isModified;
    var idx = document.title.indexOf("*");
    if (diagram.isModified) {
        if (idx < 0) document.title += "*";
    } else {
        if (idx >= 0) document.title = document.title.substr(0, idx);
    }
});
function save() {
    /* document.getElementById("mySavedModel").value = diagram.model.toJson();
    diagram.isModified = false; */
    download('Json.txt', diagram.model.toJson());
    function makeSvg() {
        var svg = diagram.makeSvg({ scale: 1, background: "white" });
        var svgstr = new XMLSerializer().serializeToString(svg);
        var blob = new Blob([svgstr], { type: "image/svg+xml" });
        myCallback(blob);
        }
    makeSvg();     
}
/* function load() {
    diagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
} */
function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}

//*****************************************************************
//load the txt file. it can be replaced and modified to read json file.
//*****************************************************************

function load(){
var inputElement = document.getElementById("files");
inputElement.addEventListener("change", handleFiles, false);
function handleFiles() {
var selectedFile = document.getElementById("files").files[0];//获取读取的File对象
var name = selectedFile.name;//读取选中文件的文件名
var size = selectedFile.size;//读取选中文件的大小
//console.log("文件名:"+name+"大小："+size);
var reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
reader.readAsText(selectedFile);//读取文件的内容
//生成模型
reader.onload = function(){
    //console.log(this.result);
    var text = this.result;
    //console.log(text);
    var nodeB = text.indexOf("nodeDataArray");
    var nodeS = text.indexOf("],");
    var linkB = text.indexOf("linkDataArray");
    var linkS = text.indexOf("]}");
    var nodeStr = text.substring(nodeB+17,nodeS);
    var linkStr = text.substring(linkB+17,linkS);
    //console.log(nodeStr);
    //console.log(linkStr);
    var L1 = nodeStr.length;
    var L2 = linkStr.length;
    var keyStr;
    var colorStr;
    var FromStr;
    var ToStr;
    for(i=0;i<L1;i++){
        if(nodeStr[i]==":"){
            for(j=i;j<L1;j++){
                if(nodeStr[j]==",")
                {
                    keyStr = nodeStr.substring(i+2,j-1);
                    //console.log(keyStr);
                    break;
                }
                else if(nodeStr[j]=="}"){
                    colorStr = nodeStr.substring(i+2,j-1);
                   //console.log(colorStr);
                    var tem = { key: keyStr, color: colorStr};
                    diagram.model.addNodeData(tem);
                    break;
                }
            }
        }
    }

    for(count=0;count<L2;count++){
        if(linkStr[count]==":"){
            for(countL=count;countL<L2;countL++){
                if(linkStr[countL]==",")
                {
                    FromStr = linkStr.substring(count+2,countL-1);
                    //console.log(FromStr);
                    break;
                }
                else if(linkStr[countL]=="}"){
                    ToStr = linkStr.substring(count+2,countL-1);
                    //console.log(ToStr);
                    var temp = { from: FromStr, to: ToStr};
                    diagram.model.addLinkData(temp);
                    break;
                }
            }
        }
    }
};
}
}


// When the blob is complete, make an anchor tag for it and use the tag to initiate a download
// Works in Chrome, Firefox, Safari, Edge, IE11
function myCallback(blob) {
    var url = window.URL.createObjectURL(blob);
    var filename = "mySVGFile.svg";

    var a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = filename;

    // IE 11
    if (window.navigator.msSaveBlob !== undefined) {
        window.navigator.msSaveBlob(blob, filename);
        return;
    }

    document.body.appendChild(a);
    requestAnimationFrame(function() {
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });
    }

//*****************************************************************
//download svg file
//*****************************************************************

function makeSvg() {
var svg = diagram.makeSvg({ scale: 1, background: "white" });
var svgstr = new XMLSerializer().serializeToString(svg);
var blob = new Blob([svgstr], { type: "image/svg+xml" });
myCallback(blob);
}
  
//*****************************************************************
//right click to add a new link
//*****************************************************************

NewlinkToAll = function(){
    var obj =[ {key:"0"},{key:"0"}];
    var i=0;
        diagram.addDiagramListener("ObjectContextClicked",
        function(e){
            var part = e.subject.part;
            if(!(part instanceof go.Link)) var firstObject = part.data;
            console.log("firstObject   "+firstObject.key);
                obj[i]= firstObject;
                i++;
                if(i==2){
                    if(obj[0].color == "#ec8c69" && obj[1].color == "#ec8c69")
                    {
                        if(obj[0].key != obj[1].key){
                            var newnode = { key: "relationship", color:"yellow"};
                            diagram.model.addNodeData(newnode);
                            var newlink2 = { from: obj[0].key, to: newnode.key };
                            diagram.model.addLinkData(newlink2);
                            var newlink3 = { from: newnode.key, to: obj[1].key };
                            diagram.model.addLinkData(newlink3);
                            obj = [ {key:"0"},{key:"0"}];
                            i=0;
                        }
                        else{
                            var newnode = { key: "attribute", color:"lightblue"};
                            diagram.model.addNodeData(newnode);
                            var newlink2 = { from: obj[0].key, to: newnode.key };
                            diagram.model.addLinkData(newlink2);
                            obj = [ {key:"0"},{key:"0"}];
                            i=0;
                        }
                        
                    }
                    else{
                        var newlink = {from: obj[0].key, to: obj[1].key};
                        diagram.model.addLinkData(newlink);
                        obj = [ {key:"0"},{key:"0"}];
                        i=0;
                    }
                }
        }
        );
}
NewlinkToAll();

function commonAttributes(position){
    var attributesTool = document.getElementById('attributesTool');
    attributesTool.style.display = 'block';
    pageX = position.x;
    pageY = position.y;
    // 设置浮动工具栏的显示位置
    console.log(pageX);
    console.log(pageY);
    attributesTool.style.left = pageX + 20 + 'px';
    attributesTool.style.top = pageY + 20 + 'px';
}


function commonRelationship(){
    var relationshipTool = document.getElementById('relationshipTool');
    relationshipTool.style.display = 'block';
    pageX = e.clientX;
    pageY = e.clientY;
    console.log("pagex"+pageX);
    console.log("pagey"+pageY);
    // 设置浮动工具栏的显示位置
    relationshipTool.style.left = pageX + 20 + 'px';
    relationshipTool.style.top = pageY + 20 + 'px';
}



//select
addItems = function() {
    var selnode = diagram.selection.first();
	if (!(selnode instanceof go.Node)) return;
    // 调用方法
    console.log(selnode.data.key);
    var items = [selnode.data.key];
    addListOption("list", items);
    var String1 = diagram.model.toJson();
    //download(selnode.data.key+'.txt', diagram.model.toJson());
    sessionStorage.setItem(selnode.data.key, String1);
    console.log(String1);
}

function addListOption(selectId, listItems) {
    // 循环遍历数组
    for (var item in listItems) {
        // 获取下拉列表框对象
        var selectID = document.getElementById(selectId);
        // 创建option元素
        var option = document.createElement("option");
        // 添加节点
        option.appendChild(document.createTextNode(listItems[item]));
        // 设置value属性
        option.setAttribute("value", listItems[item]);
        // 将option添加到下拉列表框中
        selectID.appendChild(option);
    }
}

//*****************************************************************
//common part in right of the interface
//*****************************************************************

var myPalette = $$(go.Palette,"myPaletteDiv");
myPalette.nodeTemplate = 
$$(go.Node, "Horizontal",
    $$(go.Panel,"Auto",
    $$(go.Shape, "RoundedRectangle",
    { fill: "yellow" },
    new go.Binding("fill", "color")),
        $$(go.TextBlock,
            { margin: 5 ,
            editable:true,
            text:"Object" 
            },
            new go.Binding("text", "key").makeTwoWay()) ,
    ),
    {
        click : function(e,obj){
            var newnode = { key: obj.part.data.key, color:"lightblue"};
            diagram.model.addNodeData(newnode);  // this makes sure the key is unique
            var newlink = { from: partTem.data.key, to: newnode.key };
            diagram.model.addLinkData(newlink);
        }
    }
);

myPalette.model.nodeDataArray = [
    {key:"red",color:"lightblue"},
    {key:"green",color:"lightblue"},
    {key:"blue",color:"lightblue"},
    {key:"white",color:"lightblue"},
    {key:"black",color:"lightblue"},
    {key:"yellow",color:"lightblue"},
    {key:"silver",color:"lightblue"},
    {key:"gray",color:"lightblue"}
];

var myPalette2 = $$(go.Palette,"myPaletteDiv2");
myPalette2.nodeTemplate = 
$$(go.Node, "Horizontal",
    $$(go.Panel,"Auto",
    $$(go.Shape, "RoundedRectangle",
    { fill: "yellow" },
    new go.Binding("fill", "color")),
        $$(go.TextBlock,
            { margin: 5 ,
            editable:true,
            text:"Object" 
            },
            new go.Binding("text", "key").makeTwoWay()) ,
    ),
    {
        click : function(e,obj){
            var newnode = { key: obj.part.data.key, color:"lightblue"};
            diagram.model.addNodeData(newnode);  // this makes sure the key is unique
            var newlink = { from: partTem.data.key, to: newnode.key };
            diagram.model.addLinkData(newlink);
        }
    }
);

myPalette2.model.nodeDataArray = [
{key:"thinking",color:"lightblue"},
{key:"worried",color:"lightblue"},
{key:"lost",color:"lightblue"},
{key:"stern",color:"lightblue"}
];

var myPalette3 = $$(go.Palette,"myPaletteDiv3");
myPalette3.nodeTemplate = 
$$(go.Node, "Horizontal",
    $$(go.Panel,"Auto",
    $$(go.Shape, "RoundedRectangle",
    { fill: "yellow" },
    new go.Binding("fill", "color")),
        $$(go.TextBlock,
            { margin: 5 ,
            editable:true,
            text:"Object" 
            },
            new go.Binding("text", "key").makeTwoWay()) ,
    ),
    {
        click : function(e,obj){
            var newnode = { key: obj.part.data.key, color:"lightblue"};
            diagram.model.addNodeData(newnode);  // this makes sure the key is unique
            var newlink = { from: partTem.data.key, to: newnode.key };
            diagram.model.addLinkData(newlink);
        }
    }
);

myPalette3.model.nodeDataArray = [
{key:"young",color:"lightblue"},
{key:"old",color:"lightblue"},
{key:"small",color:"lightblue"},
{key:"large",color:"lightblue"},
{key:"wooden",color:"lightblue"},
{key:"plastic",color:"lightblue"},
{key:"striped",color:"lightblue"},
{key:"bald",color:"lightblue"},
{key:"barefoot",color:"lightblue"},
{key:"asian",color:"lightblue"},
];

var myPalette4 = $$(go.Palette,"myPaletteDiv4");
myPalette4.nodeTemplate = 
$$(go.Node, "Horizontal",
    $$(go.Panel,"Auto",
    $$(go.Shape, "RoundedRectangle",
    { fill: "yellow" },
    new go.Binding("fill", "color")),
        $$(go.TextBlock,
            { margin: 5 ,
            editable:true,
            text:"Object" 
            },
            new go.Binding("text", "key").makeTwoWay()) ,
    ),
    {
        click : function(e,obj){
            var newnode = { key: obj.part.data.key, color:"lightblue"};
            diagram.model.addNodeData(newnode);  // this makes sure the key is unique
            var newlink = { from: partTem.data.key, to: newnode.key };
            diagram.model.addLinkData(newlink);
        }
    }
);

myPalette4.model.nodeDataArray = [
{key:"standing",color:"lightblue"},
{key:"sitting",color:"lightblue"},
{key:"smiling",color:"lightblue"},
{key:"playing",color:"lightblue"},
{key:"looking",color:"lightblue"},
{key:"flying",color:"lightblue"},
{key:"walking",color:"lightblue"},
{key:"eating",color:"lightblue"}
];

var myPalette5 = $$(go.Palette,"myPaletteDiv5");
myPalette5.nodeTemplate = 
$$(go.Node, "Horizontal",
    $$(go.Panel,"Auto",
    $$(go.Shape, "RoundedRectangle",
    { fill: "yellow" },
    new go.Binding("fill", "color")),
        $$(go.TextBlock,
            { margin: 5 ,
            editable:true,
            text:"Object" 
            },
            new go.Binding("text", "key").makeTwoWay()) ,
    ),
    {
        click : function(e,obj){
            var newnode = { key: obj.part.data.key, color:"yellow"};
            diagram.model.addNodeData(newnode);  // this makes sure the key is unique

            var newlink = { from: partTem.data.key, to: newnode.key };
            diagram.model.addLinkData(newlink);
        }
    }
);

myPalette5.model.nodeDataArray = [
{key:"on",color:"yellow"},
{key:"has",color:"yellow"},
{key:"in",color:"yellow"},
{key:"wears",color:"yellow"},
{key:"behind",color:"yellow"},
{key:"next to",color:"yellow"},
{key:"near",color:"yellow"},
{key:"under",color:"yellow"}
];


hide = function(){
    var t = document.getElementById('myPaletteDiv');//选取id为test的div元素
    t.style.display = 'none';// 隐藏元素
    var t = document.getElementById('myPaletteDiv2');//选取id为test的div元素
    t.style.display = 'none';// 隐藏元素
    var t = document.getElementById('myPaletteDiv3');//选取id为test的div元素
    t.style.display = 'none';// 隐藏元素
    var t = document.getElementById('myPaletteDiv4');//选取id为test的div元素
    t.style.display = 'none';// 隐藏元素
}

removeandhide = function(color,emotion,appearance,motion,newlink1,newlink2,newlink3,newlink4){
diagram.addDiagramListener("BackgroundSingleClicked",
function(e) { 
hide();
});

diagram.model.removeNodeData(color);
diagram.model.removeLinkData(newlink1);
diagram.model.removeNodeData(emotion);
diagram.model.removeLinkData(newlink2);
diagram.model.removeNodeData(appearance);
diagram.model.removeLinkData(newlink3);
diagram.model.removeNodeData(motion);
diagram.model.removeLinkData(newlink4);
}


hiderela = function(rela,newlink5){
diagram.addDiagramListener("BackgroundSingleClicked",
function(e) { 
    var t = document.getElementById('myPaletteDiv5');//选取id为test的div元素
    t.style.display = 'none';// 隐藏元素
});
diagram.model.removeNodeData(rela);
diagram.model.removeLinkData(newlink5);

}