import $ from 'jquery';
import RowMarker from './highlightTableRow';

const MAX_TEAM_ITEMS = 10;
const TAB_NAME = '구단순위';

const currentTabIdentifier = (tabName) => (currentTabName) => tabName === currentTabName;
const isCurrentTab = currentTabIdentifier(TAB_NAME);

export default ($rankingTab, $ctx, state, setState) => {
  const $tabMenu = $rankingTab.find('.tab_menu');
  const $tabShort = $rankingTab.find('.tab_short');
  const $tabShortOn = $rankingTab.find('.tab_short');
  const isHasTabShort = $tabMenu.hasClass('tab_short');

  const $leagueSelectMenu = isHasTabShort ? $tabShortOn : $tabMenu;

  const $leagueSelectMenuItems = isHasTabShort ? $leagueSelectMenu.children('.on') : $leagueSelectMenu.children();
  const $tables = $rankingTab.children('.tbl_score');
  const rowMarker = new RowMarker($rankingTab, $tables, '.select_team');

  const $leagueOptions = $leagueSelectMenu.find('[data-leagueparam]');

  const $tabWrap = $ctx.find('.tab_rwd .list_tab');
  const $extendButtons = $ctx.find('.extend_comp');

  init();

  function init() {
    rowMarker.init();
    setInitialState();
    render();
    toggleSelectOptionsOnHover($rankingTab);
    showLeaguePanelOnOptionSelect($leagueSelectMenu);
    toggleTeamTableRows();
    ExtendButton(state); // 초기 버튼 접기 || 펼치기 상태 설정. 프리마커에서 작업 된 상태로 내려오면 실행문 제거
    switchOnTabMenu();
  }


  function setInitialState() {
    const league = $leagueSelectMenuItems.not('[data-leaguedep1]').find('.tit_select').text();
    const district = $leagueSelectMenu.find('[data-leaguedep1]').not('.hide').find('.tit_select').text();
    const $tableRows = getRankingTable({league, district}).find('tbody tr');
    const $teamRank = $tableRows.filter('.select_team');
    const shouldFold = $teamRank.index() !== $tableRows.length - 1;
    const activeLeagueName = $.string.trim($leagueSelectMenu.children().not('[data-leaguedep1]').find('.tit_select').text());

    setState({
      league,
      district,
      teamRankIdx: $teamRank.index(),
      fold: shouldFold,
      action: 'init',
      leagueparam: $leagueOptions.filter((idx, each) => $.string.trim($(each).text()) === activeLeagueName).data('leagueparam')
    });
  }

  function switchOnTabMenu(){
    $tabShort.on('click','li',function(){
      $tabShort.find('li').removeClass('on');
      $(this).addClass('on');
    });
  }

  function getRankingTable(state) {
    let $table = $tables;
    if (state.league) {
      $table = $table.filter(`[data-leaguedep1="${state.league}"]`);
    }
    if (state.district) {
      $table = $table.filter(`[data-leaguedep2="${state.district}"]`);
    }
    return $table;
  }

  function toggleTeamTableRows() {
    $ctx.on('click', '.extend_comp .btn_more', () => {
      setState({
        fold: !state.rankingTab.fold,
        btnClicked: true,
        action: 'toggleTeamTableRows'
      });
    });
  }

  // State Update 발동하는 함수
  function toggleSelectOptionsOnHover($rankingTab) {
    $rankingTab.on('mouseenter', '.tab_menu > li', function() {
      $(this).find('.wrap_options').removeClass('hide');
    }).on('mouseleave', '.tab_menu > li' , function() {
      $(this).find('.wrap_options').addClass('hide');
    });
  }

  function showLeaguePanelOnOptionSelect($leagueSelectMenu) {
    // 리그탭 누르면 리그정보 업데이트
    $leagueSelectMenu.on('click', '[data-leagueparam]', function() {
      const $this = $(this);
      const league = $.trim($this.text());
      setState({
        league,
        teamRankIdx: getRankingTable($.extend({}, state, { league })).find('.select_team').index(),
        action: 'showLeaguePanelOnOptionSelect',
        leagueparam: $this.data('leagueparam')
      });
    });
    // 리그별 지구 관련 정보 누르면
    $leagueSelectMenu.on('click', '[data-leaguedep1] .place_option', function(){
      setState({ district: $(this).text() });
    });
  }

  // UI Components
  function LeagueText(league) {
    $leagueSelectMenuItems.not('[data-leaguedep1]').find('.btn_tab .tit_select').text(league);
  }
  function DistrictText(league, district) {
    $leagueSelectMenuItems.filter(`[data-leaguedep1="${league}"]`).find('.tit_select').text(district);
  }

  function RankingTable(state) {
    $tables.addClass('hide');
    getRankingTable(state).removeClass('hide');
  }

  function SubTab(league) {
    const $subTab = $leagueSelectMenuItems.filter('[data-leaguedep1]');
    $subTab.addClass('hide');
    $subTab.filter(`[data-leaguedep1="${league}"]`).removeClass('hide');
  }

  /**
   * state값에 따라 팀 목록을 노출 한다
   * 노출조건:
   * - 버튼을 유저가 한번이라도 클릭: 최대 팀 노출수만큼 보여줌
   * - 버튼을 유저가 한번도 클릭 안한 상태:
   *    - 하위팀: 하위팀에 해당하는 순위까지 노출
   *    - 10위권 이상: 팀 전부 노출
   * @param state
   */
  function TeamListItems(state) {
    const $tableRows = getRankingTable(state).find('tbody tr');
    const isLowRanking = state.teamRankIdx < MAX_TEAM_ITEMS;
    const hideAfter = (state.btnClicked) ? MAX_TEAM_ITEMS : (isLowRanking ? MAX_TEAM_ITEMS : $tableRows.length);
    const fold = () => $tableRows.removeClass('hide').slice(hideAfter).addClass('hide');
    const unfold = () => $tableRows.removeClass('hide').slice(hideAfter).removeClass('hide');
    state.fold ? fold() : unfold();
  }

  function TeamMarker(state) {
    const $tableRows = getRankingTable(state);
    rowMarker.remove();
    rowMarker.changeTable($tableRows);

    const targetIndex = rowMarker.$targetRow.index();
    const isOnTheList = targetIndex > -1;
    const isLowRank = targetIndex > 9;
    const isHighRank = isOnTheList && !isLowRank;
    const shouldRender = !state.btnClicked || isOnTheList && (isHighRank || isLowRank && !state.fold);

    if (shouldRender) {
      rowMarker.render();
      rowMarker.setMarkerPos();
    }
  }

  function ExtendButton(state) {
    const $btnExtender = $extendButtons.find('.btn_more');
    const hideAllButtons = () => $extendButtons.find('.btn_more').addClass('hide');
    const getMatchingButton = () => $extendButtons.filter(`[data-attr="${TAB_NAME}"]`);
    const $extendButton = getMatchingButton();
    const $tableRows = getRankingTable(state.rankingTab).find('tbody tr');
    const $teamItemsCnt = $tableRows.length;

    function renderButton() {
      hideAllButtons();
      const targetIndex = rowMarker.$targetRow.index();
      isCurrentTab(state.tabName) ? $extendButton.show() : $extendButton.hide();
      targetIndex < MAX_TEAM_ITEMS && $teamItemsCnt > MAX_TEAM_ITEMS ? $btnExtender.show() : $btnExtender.hide();
    }

    function toggleButtonIcon() {
      state.rankingTab.fold ? $btnExtender.removeClass('close').addClass('open') : $btnExtender.removeClass('open').addClass('close');
    }

    function toggleButtonText() {
      $btnExtender.find('.inner').text(state.rankingTab.fold ? '펼치기' : '접기');
    }

    function moveScrollPos() {
      if (state.rankingTab.action !== 'toggleTeamTableRows' || $teamItemsCnt < 10) {
        return;
      }
      const posY = state.rankingTab.fold ? $tabWrap.offset().top : $(window).scrollTop();
      window.scrollTo(0, posY);
      setState({ action: 'moveScrollPos' });
    }

    function changeLinkURL() {
      const $anchorTag = $extendButton.find('.btn_link');
      const URI = $anchorTag.attr('href').split('#');
      const host = URI[0].split('?')[0];

      const getURL = (subCode) => `${host}${subCode || `?tab=teamRank`}`;

      $anchorTag.attr('href', getURL(state.rankingTab.leagueparam));
    }
    renderButton();
    toggleButtonIcon();
    toggleButtonText();
    moveScrollPos();
    changeLinkURL();
  }


  function render() {
    //console.log(`[STATE UPDATE by ${state.action}()] `, state);
    RankingTable(state.rankingTab);
    SubTab(state.rankingTab.league);
    if( !isHasTabShort ){
      LeagueText(state.rankingTab.league);
      DistrictText(state.rankingTab.league, state.rankingTab.district);
    }

    TeamListItems(state.rankingTab);
    TeamMarker(state.rankingTab);
    ExtendButton(state);
  }


  return render;
};