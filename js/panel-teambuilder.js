function _inheritsLoose(subClass,superClass){subClass.prototype=Object.create(superClass.prototype);subClass.prototype.constructor=subClass;subClass.__proto__=superClass;}/**
 * Teambuilder Panel
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */var

TeambuilderPanel=function(_PSRoomPanel){_inheritsLoose(TeambuilderPanel,_PSRoomPanel);function TeambuilderPanel(){var _this;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this=_PSRoomPanel.call.apply(_PSRoomPanel,[this].concat(args))||this;_this.
curFolderKeep='';_this.
curFolder='';_this.
selectFolder=function(e){
var elem=e.target;
var folder=null;
while(elem){
if(elem.className==='selectFolder'){
folder=elem.getAttribute('data-value')||'';
break;
}else if(elem.className==='folderlist'){
return;
}
elem=elem.parentElement;
}
if(folder===null)return;
_this.curFolderKeep=folder;
_this.curFolder=folder;
e.preventDefault();
e.stopImmediatePropagation();
_this.forceUpdate();
};return _this;}var _proto=TeambuilderPanel.prototype;_proto.
renderFolderList=function renderFolderList(){






var folderTable={};



var folders=[];
for(var i=-2;i<PS.teams.list.length;i++){
var team=i>=0?PS.teams.list[i]:null;
if(team){
var _folder=team.folder;
if(_folder&&!(_folder+"/"in folderTable)){
folders.push('Z'+_folder);
folderTable[_folder+'/']=1;
if(!('/'in folderTable)){
folders.push('Z~');
folderTable['/']=1;
}
}
}

var format=void 0;
if(i===-2){
format=this.curFolderKeep;
}else if(i===-1){
format=this.curFolder;
}else if(team){
format=team.format;
if(!format)format='gen7';
}
if(!format)continue;
if(format in folderTable)continue;
folderTable[format]=1;
if(format.slice(-1)==='/'){
folders.push('Z'+(format.slice(0,-1)||'~'));
if(!('/'in folderTable)){
folders.push('Z~');
folderTable['/']=1;
}
continue;
}
if(format==='gen7'){
folders.push('A~');
continue;
}
switch(format.slice(0,4)){
case'gen1':format='G'+format.slice(4);break;
case'gen2':format='F'+format.slice(4);break;
case'gen3':format='E'+format.slice(4);break;
case'gen4':format='D'+format.slice(4);break;
case'gen5':format='C'+format.slice(4);break;
case'gen6':format='B'+format.slice(4);break;
case'gen7':format='A'+format.slice(4);break;
default:format='X'+format;break;}

folders.push(format);
}
folders.sort();

var gen='';
var renderedFormatFolders=[
preact.h("div",{"class":"foldersep"}),
preact.h(TeamFolder,{cur:false,value:"+"},
preact.h("i",{"class":"fa fa-plus"}),preact.h("em",null,"(add format folder)"))];



var renderedFolders=[];for(var _i=0;_i<

folders.length;_i++){var _format=folders[_i];
var newGen='';
switch(_format.charAt(0)){
case'G':newGen='1';break;
case'F':newGen='2';break;
case'E':newGen='3';break;
case'D':newGen='4';break;
case'C':newGen='5';break;
case'B':newGen='6';break;
case'A':newGen='7';break;
case'X':newGen='X';break;
case'Z':newGen='/';break;}

if(gen!==newGen){
gen=newGen;
if(gen==='/'){
renderedFolders.push.apply(renderedFolders,renderedFormatFolders);
renderedFormatFolders=[];
renderedFolders.push(preact.h("div",{"class":"foldersep"}));
renderedFolders.push(preact.h("div",{"class":"folder"},preact.h("h3",null,"Folders")));
}else if(gen==='X'){
renderedFolders.push(preact.h("div",{"class":"folder"},preact.h("h3",null,"???")));
}else{
renderedFolders.push(preact.h("div",{"class":"folder"},preact.h("h3",null,"Gen ",gen)));
}
}
var formatName=void 0;
if(gen==='/'){
formatName=_format.slice(1);
_format=formatName+'/';
if(formatName==='~'){
formatName='(uncategorized)';
_format='/';
}else{
formatName=BattleLog.escapeHTML(formatName);
}
var isCurFolder=this.curFolder===_format;
renderedFolders.push(preact.h(TeamFolder,{cur:isCurFolder,value:_format},
preact.h("i",{"class":"fa "+(
isCurFolder?'fa-folder-open':'fa-folder')+(_format==='/'?'-o':'')}),

formatName));

continue;
}
formatName=_format.slice(1);
if(formatName==='~')formatName='';
_format='gen'+newGen+formatName;
if(_format.length===4)formatName='(uncategorized)';
renderedFolders.push(preact.h(TeamFolder,{cur:this.curFolder===_format,value:_format},
preact.h("i",{"class":'fa '+(this.curFolder===_format?'fa-folder-open-o':'fa-folder-o')}),
formatName));

}
renderedFolders.push.apply(renderedFolders,renderedFormatFolders);

return preact.h("div",{"class":"folderlist",onClick:this.selectFolder},
preact.h("div",{"class":"folderlistbefore"}),

preact.h(TeamFolder,{cur:!this.curFolder,value:""},
preact.h("em",null,"(all)")),

renderedFolders,
preact.h("div",{"class":"foldersep"}),
preact.h(TeamFolder,{cur:false,value:"++"},
preact.h("i",{"class":"fa fa-plus"}),preact.h("em",null,"(add folder)")),


preact.h("div",{"class":"folderlistafter"}));

};_proto.
render=function render(){
var room=this.props.room;
var teams=PS.teams.list;

var filterFolder=null;
var filterFormat=null;
if(this.curFolder){
if(this.curFolder.slice(-1)==='/'){
filterFolder=this.curFolder.slice(0,-1);
teams=teams.filter(function(team){return team.folder===filterFolder;});
}else{
filterFormat=this.curFolder;
teams=teams.filter(function(team){return team.format===filterFormat;});
}
}

return preact.h(PSPanelWrapper,{room:room},
preact.h("div",{"class":"folderpane"},
this.renderFolderList()),

preact.h("div",{"class":"teampane"},
filterFolder?
preact.h("h2",null,
preact.h("i",{"class":"fa fa-folder-open"})," ",filterFolder," ",
preact.h("button",{"class":"button small",style:"margin-left:5px",name:"renameFolder"},
preact.h("i",{"class":"fa fa-pencil"})," Rename")," ",

preact.h("button",{"class":"button small",style:"margin-left:5px",name:"promptDeleteFolder"},
preact.h("i",{"class":"fa fa-times"})," Remove")):


filterFolder===''?
preact.h("h2",null,preact.h("i",{"class":"fa fa-folder-open-o"})," Teams not in any folders"):
filterFormat?
preact.h("h2",null,preact.h("i",{"class":"fa fa-folder-open-o"})," ",filterFormat):

preact.h("h2",null,"All Teams"),

preact.h("ul",{"class":"teamlist"},
teams.map(function(team){return preact.h("li",{key:PS.teams.getKey(team)},
preact.h(TeamBox,{team:team}));}))));




};return TeambuilderPanel;}(PSRoomPanel);var


TeamTextbox=function(_preact$Component){_inheritsLoose(TeamTextbox,_preact$Component);function TeamTextbox(){var _this2;for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2];}_this2=_preact$Component.call.apply(_preact$Component,[this].concat(args))||this;_this2.
separators=[];_this2.
textbox=null;_this2.
heightTester=null;_this2.
update=function(){
var textbox=_this2.textbox;
var heightTester=_this2.heightTester;
heightTester.style.width=textbox.offsetWidth+"px";
var value=textbox.value;

var separatorIndex=value.indexOf('\n\n');
var separators=[];
while(separatorIndex>=0){
while(value.charAt(separatorIndex+2)==='\n'){separatorIndex++;}
heightTester.value=value.slice(0,separatorIndex);
separators.push(heightTester.scrollHeight);

separatorIndex=value.indexOf('\n\n',separatorIndex+1);
}

heightTester.value=textbox.value;
textbox.style.height=heightTester.scrollHeight+100+"px";
_this2.separators=separators;
_this2.forceUpdate();
};return _this2;}var _proto2=TeamTextbox.prototype;_proto2.
componentDidMount=function componentDidMount(){
this.textbox=this.base.getElementsByClassName('teamtextbox')[0];
this.heightTester=this.base.getElementsByClassName('heighttester')[0];

var exportedTeam=PSTeambuilder.exportTeam(this.props.sets);
this.textbox.value=exportedTeam;
this.update();
};_proto2.
componentWillUnmount=function componentWillUnmount(){
this.textbox=null;
this.heightTester=null;
};_proto2.
render=function render(){var _this3=this;
return preact.h("div",{"class":"teameditor"},
preact.h("textarea",{"class":"textbox teamtextbox",onInput:this.update}),
preact.h("textarea",{
"class":"textbox teamtextbox heighttester",style:"visibility:hidden",tabIndex:-1,"aria-hidden":true}),

preact.h("div",{"class":"teamoverlays"},
this.separators.map(function(offset){return(
preact.h("hr",{style:"top:"+offset+"px"}));}),

this.props.sets.map(function(set,i){
var prevOffset=i===0?-5:_this3.separators[i-1];
return preact.h("span",{"class":"picon",style:
"top:"+(prevOffset+10)+"px;left:50px;position:absolute;"+Dex.getPokemonIcon(set.species)});

})));


};return TeamTextbox;}(preact.Component);var


TeamPanel=function(_PSRoomPanel2){_inheritsLoose(TeamPanel,_PSRoomPanel2);function TeamPanel(){var _this4;for(var _len3=arguments.length,args=new Array(_len3),_key3=0;_key3<_len3;_key3++){args[_key3]=arguments[_key3];}_this4=_PSRoomPanel2.call.apply(_PSRoomPanel2,[this].concat(args))||this;_this4.
sets=null;_this4.
backToList=function(){
PS.removeRoom(_this4.props.room);
PS.join('teambuilder');
};return _this4;}var _proto3=TeamPanel.prototype;_proto3.
render=function render(){
var room=this.props.room;
var team=PS.teams.byKey[room.id.slice(5)];
if(!team){
return preact.h(PSPanelWrapper,{room:room},
preact.h("button",{"class":"button",onClick:this.backToList},
preact.h("i",{"class":"fa fa-chevron-left"})," List"),

preact.h("p",{"class":"error"},"Team doesn't exist"));



}

var sets=this.sets||PSTeambuilder.unpackTeam(team.packedTeam);
if(!this.sets)this.sets=sets;
return preact.h(PSPanelWrapper,{room:room,scrollable:true},
preact.h("div",{"class":"pad"},
preact.h("button",{"class":"button",onClick:this.backToList},
preact.h("i",{"class":"fa fa-chevron-left"})," List"),

preact.h("h2",null,
team.name),

preact.h(TeamTextbox,{sets:sets})));


};return TeamPanel;}(PSRoomPanel);


PS.roomTypes['teambuilder']={
Model:PSRoom,
Component:TeambuilderPanel,
title:"Teambuilder"};

PS.roomTypes['team']={
Model:PSRoom,
Component:TeamPanel,
title:"Team"};

PS.updateRoomTypes();