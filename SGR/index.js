import $ from 'jquery';
import TeamHeaderUI from './TeamHeaderUI/TeamHeaderUI';
import CommonHeaderUI from './CommonHeaderUI/CommonHeaderUI';

const $ctx = $('#sgrColl');
const $listMenu = $ctx.find('.list_menu');

// 실행 블럭
init();

// 함수 선언 블럭
function init(){
  loadComponentByUIType(!!$listMenu.get(0))($ctx);
}

function loadComponentByUIType(isTeamHeaderUI) {
  return isTeamHeaderUI ? TeamHeaderUI : CommonHeaderUI;
}
