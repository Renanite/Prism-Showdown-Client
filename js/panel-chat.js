function _inheritsLoose(subClass,superClass){subClass.prototype=Object.create(superClass.prototype);subClass.prototype.constructor=subClass;subClass.__proto__=superClass;}/**
 * Chat panel
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */var

ChatRoom=function(_PSRoom){_inheritsLoose(ChatRoom,_PSRoom);




function ChatRoom(options){var _this;
_this=_PSRoom.call(this,options)||this;_this.classType='chat';_this.users={};_this.userCount=0;_this.pmTarget=null;
if(options.pmTarget)_this.pmTarget=options.pmTarget;
_this.updateTarget(true);
if(!_this.connected){
if(!_this.pmTarget)PS.send("|/join "+_this.id);
_this.connected=true;
}return _this;
}var _proto=ChatRoom.prototype;_proto.
updateTarget=function updateTarget(force){
if(this.id.startsWith('pm-')){var _this$id$slice$split=
this.id.slice(3).split('-'),id1=_this$id$slice$split[0],id2=_this$id$slice$split[1];
if(id1===PS.user.userid&&toID(this.pmTarget)!==id2){
this.pmTarget=id2;
}else if(id2===PS.user.userid&&toID(this.pmTarget)!==id1){
this.pmTarget=id1;
}else if(!force){
return;
}
this.title="[PM] "+this.pmTarget;
}
};_proto.
send=function send(line){
this.updateTarget();
if(this.pmTarget){
PS.send("|/pm "+this.pmTarget+", "+line);
return;
}
_PSRoom.prototype.send.call(this,line);
};_proto.
receive=function receive(line){
this.update(line);
};_proto.
setUsers=function setUsers(count,usernames){
this.userCount=count;
this.users={};for(var _i=0;_i<
usernames.length;_i++){var username=usernames[_i];
var _userid=toID(username);
this.users[_userid]=username;
}
this.update('');
};_proto.
addUser=function addUser(username){
var userid=toID(username);
if(!(userid in this.users))this.userCount++;
this.users[userid]=username;
this.update('');
};_proto.
removeUser=function removeUser(username,noUpdate){
var userid=toID(username);
if(userid in this.users){
this.userCount--;
delete this.users[userid];
}
if(!noUpdate)this.update('');
};_proto.
renameUser=function renameUser(username,oldUsername){
this.removeUser(oldUsername,true);
this.addUser(username);
this.update('');
};_proto.
destroy=function destroy(){
if(this.pmTarget)this.connected=false;
_PSRoom.prototype.destroy.call(this);
};return ChatRoom;}(PSRoom);var


ChatTextEntry=function(_preact$Component){_inheritsLoose(ChatTextEntry,_preact$Component);function ChatTextEntry(){var _this2;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this2=_preact$Component.call.apply(_preact$Component,[this].concat(args))||this;_this2.


subscription=null;_this2.
textbox=null;_this2.













update=function(){
var textbox=_this2.textbox;
textbox.style.height="12px";
var newHeight=Math.min(Math.max(textbox.scrollHeight-2,16),600);
textbox.style.height=newHeight+"px";
};_this2.
focusIfNoSelection=function(e){
if(e.target.tagName==='TEXTAREA')return;
var selection=window.getSelection();
if(selection.type==='Range')return;
var elem=_this2.base.children[0].children[1];
elem.focus();
};_this2.






keyDown=function(e){
if(_this2.handleKey(e)||_this2.props.onKey(e)){
e.preventDefault();
e.stopImmediatePropagation();
}
};return _this2;}var _proto2=ChatTextEntry.prototype;_proto2.componentDidMount=function componentDidMount(){var _this3=this;this.subscription=PS.user.subscribe(function(){_this3.forceUpdate();});this.textbox=this.base.children[0].children[1];if(this.base)this.update();};_proto2.componentWillUnmount=function componentWillUnmount(){if(this.subscription){this.subscription.unsubscribe();this.subscription=null;}};_proto2.submit=function submit(){this.props.onMessage(this.textbox.value);this.textbox.value='';this.update();return true;};_proto2.
handleKey=function handleKey(e){
var cmdKey=(e.metaKey?1:0)+(e.ctrlKey?1:0)===1&&!e.altKey&&!e.shiftKey;
var textbox=this.textbox;
if(e.keyCode===13&&!e.shiftKey){
return this.submit();
}else if(e.keyCode===73&&cmdKey){
return this.toggleFormatChar('_');
}else if(e.keyCode===66&&cmdKey){
return this.toggleFormatChar('*');
}else if(e.keyCode===192&&cmdKey){
return this.toggleFormatChar('`');












}
return false;
};_proto2.
toggleFormatChar=function toggleFormatChar(formatChar){
var textbox=this.textbox;
if(!textbox.setSelectionRange)return false;

var value=textbox.value;
var start=textbox.selectionStart;
var end=textbox.selectionEnd;


if(value.charAt(start)===formatChar&&value.charAt(start-1)===formatChar&&
value.charAt(start-2)!==formatChar){
start++;
}
if(value.charAt(end)===formatChar&&value.charAt(end-1)===formatChar&&
value.charAt(end-2)!==formatChar){
end--;
}


var wrap=formatChar+formatChar;
value=value.substr(0,start)+wrap+value.substr(start,end-start)+wrap+value.substr(end);
start+=2;
end+=2;


var nesting=wrap+wrap;
if(value.substr(start-4,4)===nesting){
value=value.substr(0,start-4)+value.substr(start);
start-=4;
end-=4;
}else if(start!==end&&value.substr(start-2,4)===nesting){
value=value.substr(0,start-2)+value.substr(start+2);
start-=2;
end-=4;
}
if(value.substr(end,4)===nesting){
value=value.substr(0,end)+value.substr(end+4);
}else if(start!==end&&value.substr(end-2,4)===nesting){
value=value.substr(0,end-2)+value.substr(end+2);
end-=2;
}

textbox.value=value;
textbox.setSelectionRange(start,end);
return true;
};_proto2.
render=function render(){
return preact.h("div",{"class":"chat-log-add hasuserlist",onClick:this.focusIfNoSelection},
preact.h("form",{"class":"chatbox"},
preact.h("label",{style:{color:BattleLog.usernameColor(PS.user.userid)}},PS.user.name,":"),
preact.h("textarea",{
"class":this.props.room.connected?'textbox':'textbox disabled',
autofocus:true,
rows:1,
onInput:this.update,
onKeyDown:this.keyDown,
style:{resize:'none',width:'100%',height:'16px',padding:'2px 3px 1px 3px'},
placeholder:PS.focusPreview(this.props.room)})));



};return ChatTextEntry;}(preact.Component);var


ChatPanel=function(_PSRoomPanel){_inheritsLoose(ChatPanel,_PSRoomPanel);function ChatPanel(){var _this4;for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2];}_this4=_PSRoomPanel.call.apply(_PSRoomPanel,[this].concat(args))||this;_this4.
send=function(text){
_this4.props.room.send(text);
};_this4.



focusIfNoSelection=function(){
var selection=window.getSelection();
if(selection.type==='Range')return;
_this4.focus();
};_this4.
onKey=function(e){
if(e.keyCode===33){
var chatLog=_this4.base.getElementsByClassName('chat-log')[0];
chatLog.scrollTop=chatLog.scrollTop-chatLog.offsetHeight+60;
return true;
}else if(e.keyCode===34){
var _chatLog=_this4.base.getElementsByClassName('chat-log')[0];
_chatLog.scrollTop=_chatLog.scrollTop+_chatLog.offsetHeight-60;
return true;
}
return false;
};return _this4;}var _proto3=ChatPanel.prototype;_proto3.focus=function focus(){this.base.querySelector('textarea').focus();};_proto3.
render=function render(){
return preact.h(PSPanelWrapper,{room:this.props.room},
preact.h("div",{"class":"tournament-wrapper hasuserlist"}),
preact.h(ChatLog,{"class":"chat-log hasuserlist",room:this.props.room,onClick:this.focusIfNoSelection}),
preact.h(ChatTextEntry,{room:this.props.room,onMessage:this.send,onKey:this.onKey}),
preact.h(ChatUserList,{room:this.props.room}));

};return ChatPanel;}(PSRoomPanel);var


ChatUserList=function(_preact$Component2){_inheritsLoose(ChatUserList,_preact$Component2);function ChatUserList(){var _this5;for(var _len3=arguments.length,args=new Array(_len3),_key3=0;_key3<_len3;_key3++){args[_key3]=arguments[_key3];}_this5=_preact$Component2.call.apply(_preact$Component2,[this].concat(args))||this;_this5.
subscription=null;return _this5;}var _proto4=ChatUserList.prototype;_proto4.
componentDidMount=function componentDidMount(){var _this6=this;
this.subscription=this.props.room.subscribe(function(msg){
if(!msg)_this6.forceUpdate();
});
};_proto4.
componentWillUnmount=function componentWillUnmount(){
if(this.subscription)this.subscription.unsubscribe();
};_proto4.
render=function render(){
var room=this.props.room;
var userList=Object.entries(room.users);
userList.sort(ChatUserList.compareUsers);
function colorStyle(userid){
return{color:BattleLog.usernameColor(userid)};
}
return preact.h("ul",{"class":"userlist"},
preact.h("li",{"class":"userlist-count",style:"text-align:center;padding:2px 0"},preact.h("small",null,room.userCount," users")),
userList.map(function(_ref){var userid=_ref[0],name=_ref[1];
var groupSymbol=name.charAt(0);
var group=PS.server.groups[groupSymbol]||{type:'user',order:0};
return preact.h("li",{key:userid},preact.h("button",{"class":"userbutton username","data-name":name},
preact.h("em",{"class":"group"+(['leadership','staff'].includes(group.type)?' staffgroup':'')},groupSymbol),
group.type==='leadership'?
preact.h("strong",null,preact.h("em",{style:colorStyle(userid)},name.substr(1))):
group.type==='staff'?
preact.h("strong",{style:colorStyle(userid)},name.substr(1)):

preact.h("span",{style:colorStyle(userid)},name.substr(1))));


}));

};ChatUserList.
compareUsers=function compareUsers(_ref2,_ref3){var userid1=_ref2[0],name1=_ref2[1];var userid2=_ref3[0],name2=_ref3[1];
if(userid1===userid2)return 0;
var rank1=(
PS.server.groups[name1.charAt(0)]||{order:10006.5}).
order;
var rank2=(
PS.server.groups[name2.charAt(0)]||{order:10006.5}).
order;

if(userid1==='zarel'&&rank1===10003)rank1=10000.5;
if(userid2==='zarel'&&rank2===10003)rank2=10000.5;
if(rank1!==rank2)return rank1-rank2;
return userid1>userid2?1:-1;
};return ChatUserList;}(preact.Component);var


ChatLog=function(_preact$Component3){_inheritsLoose(ChatLog,_preact$Component3);function ChatLog(){var _this7;for(var _len4=arguments.length,args=new Array(_len4),_key4=0;_key4<_len4;_key4++){args[_key4]=arguments[_key4];}_this7=_preact$Component3.call.apply(_preact$Component3,[this].concat(args))||this;_this7.
log=null;_this7.
subscription=null;return _this7;}var _proto5=ChatLog.prototype;_proto5.
componentDidMount=function componentDidMount(){var _this8=this;
this.log=new BattleLog(this.base);
this.subscription=this.props.room.subscribe(function(msg){
if(!msg)return;
var tokens=PS.lineParse(msg);
switch(tokens[0]){
case'title':
_this8.props.room.title=tokens[1];
PS.update();
return;
case'users':
var usernames=tokens[1].split(',');
var count=parseInt(usernames.shift(),10);
_this8.props.room.setUsers(count,usernames);
return;
case'join':case'j':case'J':
_this8.props.room.addUser(tokens[1]);
break;
case'leave':case'l':case'L':
_this8.props.room.removeUser(tokens[1]);
break;
case'name':case'n':case'N':
_this8.props.room.renameUser(tokens[1],tokens[2]);
break;}

_this8.log.add(tokens);
});
};_proto5.
componentWillUnmount=function componentWillUnmount(){
if(this.subscription)this.subscription.unsubscribe();
};_proto5.
shouldComponentUpdate=function shouldComponentUpdate(props){
if(props["class"]!==this.props["class"]){
this.base.className=props["class"];
}
this.log.updateScroll();
return false;
};_proto5.
render=function render(){
return preact.h("div",{"class":this.props["class"],role:"log",onClick:this.props.onClick});
};return ChatLog;}(preact.Component);


PS.roomTypes['chat']={
Model:ChatRoom,
Component:ChatPanel};

PS.updateRoomTypes();