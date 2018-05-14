import $                from 'jquery';
import RealTimeWatch    from './realtimeWatch';
import displaySelectBox from '../../core/displaySelectBox';
import useTimeMachine   from '../../core/useTimeMachine';
import RankingTab       from './rankingTab';
import ScheduleTab      from './scheduleTab';
import playerTab        from "./playerTab";

const TAB_NAME_MAP = {
  'schedule': '일정',
  'teamRank': '구단순위',
  'player': '주요선수',
  'baseInfo': '구단정보'
};

const currentTabIdentifier = (tabName) => (currentTabName) => tabName === currentTabName;
const isCurrentTab = currentTabIdentifier(TAB_NAME_MAP['teamRank']);

export default ($ctx) => {
  const $tabWrap = $ctx.find('.wrap_team');
  const $listTab = $tabWrap.find('.list_menu');
  const $listTabItems = $listTab.children(); //.menu_item
  const $mainPanels = $ctx.find('.cont_wrap');
  const $teamNameButtonDown = $ctx.find('.tit_name');
  const $gameListWrap = $ctx.find('.wrap_sports');
  const $extendButtons = $ctx.find('.extend_more');
  const timeMachine = useTimeMachine('SGR', (storedState) => {
    setState(storedState);
  });
  const state = {
    tabIdx: 0,
    tabName: '',
    schedulePageIndex: 0,
    fold: true
  };

  setInitialState();
  togglePanelsOnTabClick();
  initCountDownTimer($ctx);
  toggleTeamSelectWindow($ctx, $teamNameButtonDown);


  render(
    MainTab(state),
    MainPanel(state),
    ScheduleTab(getPanelByTabName('일정'), $ctx, state, setState),
    ExtendButton(state),
    RankingTab(getPanelByTabName('구단순위'), $ctx, state, setState),
    playerTab(getPanelByTabName('주요선수'), $ctx, state, setState)
  );
  timeMachine.check();

  function setState(newState) {
    $.extend(state, newState);
    $(state).trigger('update');
  }

  function setInitialState() {
    setState({
      tabIdx: $listTabItems.filter('.on').index(),
      tabName: TAB_NAME_MAP[C.sportsColl.SGR.tabInfo],
      schedulePageIndex: $gameListWrap.find('.list_game').not('.hide').index()
    });
  }

  function getPanelByTabName(tabName) {
    return $mainPanels.eq($listTabItems.filter((i, each) => $.string.trim($(each).text()) === tabName).index());
  }

  function togglePanelsOnTabClick() {
    $listTab.on('click', 'li', function() {
      const $this = $(this);
      setState({
        tabIdx: $this.index(),
        tabName: $.string.trim($this.text())
        //selectorOffsetTop 삭제
				}
      );
    });
  }

  function render(...fns) {
    $(state).on('update', function() {
      fns.forEach(fn => fn());
      timeMachine.storage.set(state);
    });
  }

  // UI Components
  function MainTab(state) {
    return () => {
      $listTabItems.removeClass('on');
      $listTabItems.eq(state.tabIdx).addClass('on');
    };
  }

  function MainPanel(state) {
    return () => {
      $mainPanels.addClass('hide');
      $mainPanels.eq(state.tabIdx).removeClass('hide');
    };
  }

  function ExtendButton(state) {
    const $extendButton = $extendButtons.filter(`[data-attr="구단순위"]`);
    return () => {
      if (!isCurrentTab(state.tabName)) {
        return $extendButton.addClass('hide');
      }

      const $teams = $mainPanels.eq(state.tabIdx).find('tbody tr');
      const $btnIcon = $extendButton.find('.btn_more');

      $extendButton.removeClass('hide');
      $teams.length > 10 ? $btnIcon.show() : $btnIcon.hide();

    };
  }
};

function initCountDownTimer($ctx) {
  const startTime = ('' + $ctx.find('.state_info').data('starttime')).slice(0, 14);
  const $timeIndicator = $ctx.find('.txt_time');

  if (typeof startTime !== 'string' || startTime.length !== 14) {
    return;
  }
  const countdownWatch = new RealTimeWatch(startTime, (diff) => {
    if (diff.reduce((a, b) => a + b) <= 0) {
      countdownWatch.stop();
      $timeIndicator.replaceWith('<span class="ico_sports ico_live">LIVE</span>');
    } else {
      $timeIndicator.text(diff.map(RealTimeWatch.addZero).join(':'));
    }
  });

  countdownWatch.start();

  return countdownWatch;
}

function toggleTeamSelectWindow($ctx, $teamNameButtonDown) {
  const toggleSelectBox = displaySelectBox({
    $ctx
  });
  $teamNameButtonDown.on('click', function() {
    toggleSelectBox.toggle();
  });
}