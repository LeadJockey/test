import $ from 'jquery';

export default ($playerTab, $ctx, state, setState) =>{

  const $subTabList = $playerTab.find('.wrap_sub .menu_item');
  const $contList = $playerTab.find('.player_cont');

  init();

  function init(){
    setInitialState();
    loadExtendModule();
    bindEvents();
  }

  function setInitialState(){
    setState({
      action:'init',
      currentIdx:0,
      fold:true
    });
  }

  function attachClass($cont, targetClassName, siblingClassName){
    const siblingClass = siblingClassName || '';
    $cont.addClass(targetClassName).siblings(siblingClass).removeClass(targetClassName);
  }

  function detachClass($cont, targetClassName, siblingClassName){
    const siblingClass = siblingClassName || '';
    $cont.removeClass(targetClassName).siblings(siblingClass).addClass(targetClassName);
  }

  function loadExtendModule(){
    $contList.each(function(idx,eachCont){
      const $eachCont = $(eachCont);
      new SF.extend({
          expender:$eachCont.find('.extend_more'), //더보기 버튼 wrapper
          container:$eachCont.find('.list_player'), //노출제어할 리스트 영역
          viewCount:10
        });
    });
  }

  function bindEvents(){
    $subTabList.on('click', function(){
      setState({ currentIdx:$(this).index() });
    });
  }

  function render(){
    attachClass($subTabList.eq(state.currentIdx), 'on');
    detachClass($contList.eq(state.currentIdx), 'hide', '.player_cont');
  }

  return render;
};