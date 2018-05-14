import $ from 'jquery';
import displaySelectBox from '../../core/displaySelectBox';
import ScheduleTab from './scheduleTab';
import RankingTab from './rankingTab';
import useTimeMachine from '../../core/useTimeMachine';

export default ($ctx) => {
  const $tabWrap = $ctx.find('.tab_rwd');
  const $listTab = $tabWrap.find('.list_tab');
  const $listTabItems = $listTab.children();
  const $teamNameButtonDown = $ctx.find('.tit_overseas');
  const $mainPanels = $ctx.find('.cont_wrap');
  const $tabRwdBox = $tabWrap.find('.list_tab').children();
  const $initialActiveTab = $listTabItems.filter('.on');
  const setState = stateSetter();
  const timeMachine = useTimeMachine('SGR', (storedState) => setState(storedState));

  const state = {
    tabIdx: $initialActiveTab.index(),
    tabName: $.string.trim($initialActiveTab.text()),
    scheduleTab: {
      schedulePageIndex: 0
    },
    rankingTab: {
      league: '',
      district: '',
      fold: true,
      teamRankIdx: -1,
      btnClicked: false,
      action: '',
      leagueparam: ''
    }
  };

  render(
    MainTab(state),
    MainPanel(state),
    ScheduleTab(getPanelByTabName('일정'), $ctx, state, stateSetter('scheduleTab')),
    RankingTab(getPanelByTabName('구단순위'), $ctx, state, stateSetter('rankingTab'))
  );

  timeMachine.check();

  showPanelsOnTabClick();
  toggleTeamSelectWindow({
    $ctx,
    $teamNameButtonDown,
    selector: $ctx.find('.wrap_league'),
    listTeam: $ctx.find('.overseas_cont, .list_team'),
    titName: $teamNameButtonDown,
    arrowBottom : 'bottom_arrow',
    arrowTop : 'top_arrow'
  });


  function stateSetter(dir) {
    return function(newState) {
      $.extend(true, dir ? state[dir] : state, newState);
      $(state).trigger('update');
    };
  }

  function render(...fns) {
    $(state).on('update', function() {
      fns.forEach(fn => fn());
      timeMachine.storage.set(state);
    });
  }

  function getPanelByTabName(tabName) {
    return $mainPanels.eq($tabRwdBox.filter((i, each) => $.string.trim($(each).text()) === tabName).index());
  }

  function showPanelsOnTabClick() {
    $listTab.on('click', 'li', function() {
      const $this = $(this);

      setState({
        tabIdx: $this.index(),
        tabName: $.string.trim($this.text())
      });
    });
  }

  function MainTab(state) {
    return () => $listTabItems.removeClass('on').eq(state.tabIdx).addClass('on');
  }

  function MainPanel(state) {
    return () => $mainPanels.addClass('hide').eq(state.tabIdx).removeClass('hide');
  }

};

// Static Functions
function toggleTeamSelectWindow(opts) {
  const toggleSelectBox = displaySelectBox(opts);
  opts.$teamNameButtonDown.on('click', function() {
    toggleSelectBox.toggle();
  });
}



